#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

######################################################################
# PY stage that simply does a pip install on our requirements
######################################################################
ARG PY_VER=3.6.9
FROM python:${PY_VER} AS superset-py
#RUN mkdir /etc/apt
#COPY /etc/apt/sources.list /etc/apt/
RUN mkdir /app \
       # && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys  3B4FE6ACC0B21F32 \
        && apt-get update -y \
        && apt-get install -y --no-install-recommends \
            build-essential \
            default-libmysqlclient-dev \
            libpq-dev \
        &&  apt-get install   libsasl2-dev python-dev  libldap2-dev  libssl-dev  db-util  sasl2-bin libsasl2-modules   -y  \
        && rm -rf /var/lib/apt/lists/*

# First, we just wanna install requirements, which will allow us to utilize the cache
# in order to only build if and only if requirements change
COPY ./requirements.txt /app/
RUN cd /app \
        && pip install --no-cache -r requirements.txt -i https://pypi.douban.com/simple


######################################################################
# Node stage to deal with static asset construction
######################################################################
FROM node:10-jessie AS superset-node

ARG NPM_BUILD_CMD="build"
ENV BUILD_CMD=${NPM_BUILD_CMD}

# NPM ci first, as to NOT invalidate previous steps except for when package.json changes
RUN mkdir -p /app/superset-frontend
RUN mkdir -p /app/superset/assets
COPY ./docker/frontend-mem-nag.sh /
COPY ./superset-frontend/package* /app/superset-frontend/
RUN /frontend-mem-nag.sh \
        && cd /app/superset-frontend \
        && npm --registry https://registry.npm.taobao.org ci 

# Next, copy in the rest and let webpack do its thing
COPY ./superset-frontend /app/superset-frontend
# This is BY FAR the most expensive step (thanks Terser!)
RUN cd /app/superset-frontend \
        && npm run ${BUILD_CMD} \
        && rm -rf node_modules
######################################################################
# Final lean image...
######################################################################
ARG PY_VER=3.6.9
FROM python:${PY_VER} AS lean

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    FLASK_ENV=production \
    FLASK_APP="superset.app:create_app()" \
    PYTHONPATH="/app/pythonpath" \
    SUPERSET_HOME="/app/superset_home" \
    SUPERSET_PORT=8080
RUN apt-get update
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
        &&  apt-get clean &&  apt-get install  -y ./google-chrome-stable_current_amd64.deb
RUN wget https://chromedriver.storage.googleapis.com/87.0.4280.88/chromedriver_linux64.zip \
          && unzip chromedriver_linux64.zip \
          && mv ./chromedriver /usr/local/bin

COPY ./docker/simhei.ttf ./docker/simsun.ttc /usr/share/fonts/
RUN fc-cache
RUN useradd --user-group --no-create-home --no-log-init --shell /bin/bash superset \
        && mkdir -p ${SUPERSET_HOME} ${PYTHONPATH} \
        && apt-get update -y \
        && apt-get install -y --no-install-recommends \
            build-essential \
            default-libmysqlclient-dev \
            libpq-dev \
        && apt-get install   libsasl2-dev python-dev  libldap2-dev  libssl-dev  db-util  sasl2-bin libsasl2-modules   -y  \
        && rm -rf /var/lib/apt/lists/*

COPY --from=superset-py /usr/local/lib/python3.6/site-packages/ /usr/local/lib/python3.6/site-packages/
# Copying site-packages doesn't move the CLIs, so let's copy them one by one
COPY --from=superset-py /usr/local/bin/gunicorn /usr/local/bin/celery /usr/local/bin/flask /usr/bin/
COPY --from=superset-node /app/superset/static/assets /app/superset/static/assets
COPY --from=superset-node /app/superset-frontend /app/superset-frontend
#COPY --from=superset-node /app/superset/assets /app/superset/assets

## Lastly, let's install superset itself
COPY superset /app/superset

COPY --from=superset-node /app/superset/assets /app/superset/assets

COPY setup.py MANIFEST.in README.md /app/
RUN cd /app \
        && chown -R superset:superset * \
        && pip install -i https://pypi.douban.com/simple  -e  .

COPY ./docker/docker-entrypoint.sh /usr/bin/

WORKDIR /app

USER superset

HEALTHCHECK CMD ["curl", "-f", "http://localhost:8088/health"]

EXPOSE ${SUPERSET_PORT}

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]

######################################################################
# Dev image...
######################################################################
FROM lean AS dev

COPY ./requirements* ./docker/requirements* /app/

USER root
# Cache everything for dev purposes...
RUN cd /app \
    && pip install --ignore-installed -e  -i https://pypi.douban.com/simple .  \
    && pip install --ignore-installed -r requirements.txt -i https://pypi.douban.com/simple \
    && pip install --ignore-installed -r requirements-dev.txt -i https://pypi.douban.com/simple \
    && pip install --ignore-installed -r requirements-extra.txt -i https://pypi.douban.com/simple \
    && pip install --ignore-installed -r requirements-local.txt  -i https://pypi.douban.com/simple || true
#USER superset
