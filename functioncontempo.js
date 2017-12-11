function insertData(
	index, date, opening, high,
	low, close, adjclose,  volume
) {
	db.stockdata.insert({
		Index: index,
		Date: date,
		opening: opening,
		high: high,
		low: low,
		close: close,
		adj_close: adjclose, 
		volume:  volume
	});
	print("added data!");
}