var initArray = []; //div by 12
var initArray26 = []; //div by 26
var initArray9 = []; //div by 9
var averaged = []; // sum of values 12
var averaged26 = []; // sum of values 26
var averaged9 = []; // sum of values 9
var arrayMACD = []; //difference between 12 and 26
var size = db.stockdata.count();
var closeArray = db.stockdata.find().toArray();//array of db values



for(i=0;i<size;i++) //pushes to div arrays
    {
        initArray.push(closeArray[i].close/12);
        initArray26.push(closeArray[i].close/26);
    }


for(i=0;i<size;i++) //pushes to sum of values 12 array
{
    tmp = 0;
    for(j=i+11; j>=i; j--)
    {
        tmp = tmp+initArray[j];
    }
    averaged.push(tmp);
}

for(i=0;i<size;i++) //pushes to sum of values 26 array
{
    tmp = 0;
    for(j=i+25; j>=i; j--)
    {
        tmp = tmp+initArray26[j];
    }
    averaged26.push(tmp);
}

//to make them correspond, start ma12 at index = 14

for(i=0;i<size;i++) //MACD line
{
    arrayMACD.push(averaged[i+14]-averaged26[i]);
}



for(i=0;i<size;i++) //push to div by 9 arrayy
    {
        initArray9.push(arrayMACD[i]/9);
    }

for(i=0;i<size;i++) //push to sum of 9 array
{
    tmp = 0;
    for(j=i+8; j>=i; j--)
    {
        tmp = tmp+initArray9[j];
    }
    averaged9.push(tmp);
}

// db.stockdata.update(
//     {Index: 1},{$set: {"something": 'somethingelse'}})

for(i=0;i<size;i++) // update stockdata collection
{

    db.stockdata.update(
    {Index: i+26},{$set: {"MACD": arrayMACD[i], "Signal": averaged9[i-8]}})
    print("lodi");
}

//map 1: return ones where MACD>signal

map1 = function() { 
    if(this.MACD > 0)
    {
        emit({date: this.Date}, {Index: this.Index, MACD: this.MACD, Signal: this.Signal})
    }
}

reduce1 = function(key, values) {
 
    var count = 0;
    for (var i = values.length; i--;) {count+=values[i]}
        return count;
}


results = db.runCommand({
    mapReduce: 'stockdata',
    map: map1,
    reduce: reduce1,
    out: 'stockdata.answer1'
});





map2 = function() { 
    if(this.value.MACD > this.value.Signal)
    {
        emit({date: this._id.date, MACD: this.value.MACD, Signal: this.value.Signal},1)
    }
}

reduce2 = function(key, value) {
    var count = 0;
    for (var i = value.length; i--;) {count+=value[i]}
        return count;

}


results = db.runCommand({
    mapReduce: 'stockdata.answer1',
    map: map2,
    reduce: reduce2,
    out: 'stockdata.answer2'
});










// var finalarr = db.stockdata.answer1.find().toArray();
// var MACDarr = [];
// var Signalarr = [];

// printjson(finalarr[1])

// for(var i=0;i<100;i++) //pushes to div arrays
//     {var thing = i;
//       MACDarr.push(finalarr[thing].value.MACD);
//       Signalarr.push(finalarr[thing].value.Signal);
//     }



