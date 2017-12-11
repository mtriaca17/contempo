How to load dataset: first, load the insertData function (functioncontempo.js) then, use load() function for the data4.js file.; load("data4.js")
data was transformed from excel to .js format using a python script. (contemposcript.py)

how to set up replicate:

Create config servers using:

Mongod --configsvr --replSet <cfgreplsetname> --dbpath <path-to-config> --port <unique port, not 27017>

example:
Mongod --configsvr --replSet “cfg” --dbpath \data\db\config\cfg1 --port 26050

Initiate the replica set by opening another cmd

Mongo --host <host>t --port <configsvr-you-want-as-primary>

Example:
Mongo --host localhost --port 26050

rs.initiate(
{ _id:<cfgreplsetname>,
Configsvr:true,
Members:[
{_id:0,host:”<hostname>:<portnum>”},
{_id:1,host:”<hostname>:<portnum>”},
{_id:2,host:”<hostname>:<portnum>”}
]
}
)

Connect a mongos to the configsvr:
This mongos is a query router that the clients will talk to, it will look at the configsvr for the metadata on the shard clusters
Another cmd

Mongos --configdb “<cfgreplsetname>/<examplehost:cfgsrv1port>,<examplehost:cfgsrv2port>,<examplehost:cfgsrv3port>”

How to set up map reduce/run mapreduce
all set up is in mapreduce.js file. to run just load the file with load function or copy paste the contents.

how to shard

Open new cmds

Mongod --shardsrv --replSet “<shardreplname>” --dbpath <path-to-shard-db> --port <unique port>

Example:

Mongod --shardsvr --replSet “set1” --dbpath \data\db\shards\set1\sh1 --port 19000

Initiate shard replica set with another cmd:

Mongo --host <host> --port <port-of-primary-shard>


Initiate that server as primary 

Rs.initiate (
{
_id:”<shardreplname>”,
Members: [
{_id:0,host:”s1-mongo1.example.net:<shardportnum>”},
{_id:1,host:”s1-mongo2.example.net:<shardportnum>”},
{_id:2,host:”s1-mongo3.example.net:<shardportnum>”}
]
}
)


In the mongos cmd
Add the shard clusters by
sh.addShard(“<shardreplsetname>/<host>:<primaryport>”)

Example:
sh.addShard(“set1/localhost:19000”)



To enable sharding for a db

sh.enableSharding(“<dbname>”)

To shard collections in that db

sh.shardCollection(“<dbname>.<collectionname>”,{<_uniqueshardkey>:1})

sh.shardCollection(“<db>.<collection>”,{“number”:1})

sh.status() to check on your shards
 
