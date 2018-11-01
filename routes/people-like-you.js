'user-strict';

const router   		= require('express').Router();
const csv 			= require('csvtojson');
const similarity 	= require( 'compute-cosine-similarity' );
/*
Compare array 
	https://stackoverflow.com/questions/52422073/node-js-cosine-similarity-between-array-and-object-array
	https://github.com/compute-io/cosine-similarity

CsvtoJson
	https://www.npmjs.com/package/csvtojson
*/

router.route('/')
.get((req, res) => {
	// console.log(req.query);
	let data = {};
	csv().fromFile("./data/data.csv").then(source => {
		let req_query	= cekQueryParam(req.query);
		let result 		= source.filter(search, req_query);
		let resultFinal = ArrScore(result,req_query); 
		data.peopleLikeYou = resultFinal;
		res.send(JSON.stringify(data.peopleLikeYou
			.sort(function(a, b) {return b.score - a.score})	// Sorting by Score Desc
			.slice(0,10)));										// Top 10
	});
	
});

/*
Some --> like or || Any -->return value true
Every --> like And && All -->return value true
*/

// function search(source){
//   	return Object.keys(this).some((key) => source[key] === this[key]);
// };
function search(source){
  	return Object.keys(this).every((key) => source[key] === this[key]);
};

function cekQueryParam(query){
	let	queryParam ={};

	queryParam = query;
	if(queryParam['monthlyIncome']){
		queryParam['monthly income'] = query['monthlyIncome'];
		delete queryParam['monthlyIncome'];
	}
	return queryParam;
};

function ArrScore(data,param){
	let dataValueLine 	= [];
	let dataParam 		= [];
	let i = 0;
	for(l in data[0]){
		if(l !== 'name'){
			if(l ==='experienced'){
				dataParam.push(1);	
			}else{
				// When value is True then insert to ParamValue
				if(param.hasOwnProperty(l)){
					dataParam.push(param[l]);	
				}else{
					dataParam.push('');	
				}
			}
		}
	}	

	for(m in data){
		dataValueLine =[];
		for (n in Object.keys(data[m])){
			if ((Object.keys(data[m])[n])!=='name'){
				if ((Object.keys(data[m])[n])==='experienced'){
					dataValueLine.push(1);
				}else{
					dataValueLine.push(Object.values(data[m])[n]);
				}
			}
		}
		//Compare with 2 array
		data[m].score = similarity(dataValueLine,dataParam);
	}
	return data;
	
};

module.exports = router;