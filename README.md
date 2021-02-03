# Superbi
## 引言
superbi 是达闼科技以开源项目superset为基础开发的企业级快速BI应用。
可扩展的框架设计，支持多种DBMS数据源，让数据BI更加简单。
superbi提供直观的UI，拖拽式的编辑体验，配置式的图例创建，轻松创建数据可视化dashboard的能力。

## 图例展示
[![](https://i.loli.net/2020/10/23/6jRYo2ZpOaD8yXz.png)](https://i.loli.net/2020/10/23/6jRYo2ZpOaD8yXz.png)

## superbi能做什么
- 提供丰富的可视化图例，包含基本的折线图，饼图，GL可视化图例等近60种图例
- 简单易用，无需代码，配置式创建的图例，拖拽编辑体验的dashboard。
- 先进的SQL在线编辑器，IDE式的体验，让你可以方便快捷的浏览元数据。
- 集成企业级的用户权限管理，并可以与其他身份验证系统集成（OpenID, LDAP, OAuth, REMOTE_USER）
- 自定义SQL扩展，提供对复杂情况的数据可视化能力。
- 集成echarts，3d word cloud，更加高度可配置的图表UI效果展示
-  对使用了多条SQL的图列，返回结果需要自行处理

## 功能介绍
### 1.自定义SQL  

  在原始superset中，可以通过选择各种条件控制数据的返回，如果有稍微复杂的应用场景则不能实现，比如对一张表自联返回想要的结果。正是有这样的需求，我们在每一个图例编辑界面加入了一个SQL编辑框，可以在 编辑框中编辑SQL原生语句来实现我们的需求。
### 使用效果  
   ![Screen Shot 2020-02-25 at 11.13.33 AM _1_.png](https://i.loli.net/2020/10/23/gxuGdA19mXnBwDJ.png)  
#### 带FilterBox的SQL语句
  当我们在Dashboards里面使用了FilterBox图例，实现全局的过滤的时候，SQL语句里面要使用变量@filters来表示过滤条件，例如：

         SELECT "LON" AS "LON","LAT" AS "LAT",COUNT(*) AS count FROM long_lat WHERE @filters GROUP BY "LON","LAT" ORDER BY count DESC LIMIT 5000 OFFSET 0;

  在WHERE后加上一个变量@filters,变量表示在FilterBox中选择的过滤条件
  
#### 可选FilterBox字段
   当我们在一个Dashboard中同时使用多个数据源时，有可能会出现多个数据源字段与FilterBox字段不匹配的情况，这种情况下如果还是使用@filters占位符来替代筛选条件则会出现过滤失败，
   这种情况下可以使用${column}可选筛选项来代替@filters,${column}与@filters相比的优势在于它可以精确到具体的筛选字段，更加灵活。
   示例： 
   
	SELECT supplier AS supplier,
	       COUNT(*) AS count
	FROM sv.v_hitlog_2003
	WHERE ${tdate} and ${supplier}
	GROUP BY supplier
	ORDER BY count DESC
	LIMIT 10000
   展示效果
   ![QQ截图20201201155105.png](https://i.loli.net/2020/12/01/5tHGTAk3OcuL8UY.png)
#### 多select合并查询
   在某些图列中，一个SQL语句的查询结果不能满足我们的需求，这个时候需要多条的SQL语句执行需求  
   在编写SQL语句的时候加入变量@split,对多条SQL语句进行分割，例如：
   
    SELECT state AS state,num AS num FROM birth_names GROUP BY state,num ORDER BY COUNT(*) DESC LIMIT 10 OFFSET 0;
    @split
    SELECT state AS state2, num AS num2 FROM birth_names GROUP BY state2,num2 ORDER BY COUNT(*) DESC LIMIT 10 OFFSET 0;
   如上示例代码，由两个SQL语句加变量@split组成，可以使用@split分割任意多的SQL语句。
### SQL案例
   ![image2020-4-9 11_10_36.png](https://i.loli.net/2020/10/23/zImdV6Ac8pHrUvF.png)
### 使用效果
![image2020-4-9 11_12_9.png](https://i.loli.net/2020/10/23/RXTN8fn39DG6vjb.png)
   
### 注意事项
   原则上我们需要尽量避免使用SQL编辑框这个选项在有其他方法可以实现我们的需求的时候，在使用时我们需要遵守下面这几点避免出现错误
- SQL语句只能对一张表进行操作
- 在使用了SQL的图例的里面必须选择正确的Datasource和Visualization Type，Datasource对应SQL语句中操作的数据库表，Visualization Type和SQL语句的返回结果相对应。选择了Visualization Type，SQL必须返回相对应的格式，否则必然出现错误。
- 对使用了SQL的图例，TimeRange选项选为 No filter

### 2.unicode字符集支持
  对superset导出excel,csv等文件编码问题进行了优化，使其支持unicode字符集，对含有中文内容的导出文件更加友好。

### 3.大屏模式
- 在分享链接下打开时，dashboard会进入大屏演示模式，使得浏览演示更加轻松高效。
- 案例，使用superbi制作的大屏
![4Y_8AGB5T0S8RNB_T4_M1IO.png](https://i.loli.net/2020/12/01/FOpXKMjzed5ulfS.png)

## 支持的数据库
|             数据库类型           |          驱动安装        |       连接字符串          |
| ---------------------- | ------------------------ | ------------------------ |
|  clickhouse  |  pip install sqlalchemy-clickhouse  |   clickhouse://{username}:{password}@{hostname}:{port}/{database}  |
| Apache Kylin | pip install kylinpy | kylin://{username}:{password}@{hostname}:{port}/{project}?{param1}={value1}&{param2}={value2} |
|Apache Hive|pip install pyhive|hive://hive@{hostname}:{port}/{database}|
|Apache Impala|pip install impala|impala://{hostname}:{port}/{database}|
|Apache Spark SQL|pip install pyhive|hive://hive@{hostname}:{port}/{database}|
|MySQL| pip install mysqlclient| mysql://&lt;UserName>:&lt;DBPassword>@&lt;Database Host>/&lt;Database Name>|
|PostgreSQL|pip install psycopg2|postgresql:://&lt;UserName>:&lt;DBPassword>@&lt;Database Host>/&lt;Database Name>|
## 安装&运行
### 前置依赖
1. docker
2. docker-compose

### 安装步骤

    git clone https://github.com/CloudmindsRobot/superBI.git
    
    cd superbi
    
    docker-compose up
	
启动成功后在浏览器中输入地址http://localhost:8088 即可访问
- 用户名： admin
- 密码: admin



