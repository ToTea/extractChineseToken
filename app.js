var PATtree = require("pat-tree");
var fs = require('fs');

function extractSLPs(doc, tftheshold, setheshold){
	/**
		extract term with frequency
		@parm: string doc, string to extract terms
		@return: [{"sistring": string, "frequency": float}] SLPs, extract terms
	*/
	
	// ***Caution the different caracters of enter between different os***
	var line_character = '\r\n';

	// replace symbols with space
	doc = doc.replace(/([.*+?^=!:\;${}()|\[\]\/\\a-zA-Z「」：；（）0-9％《》，！？。℃、／\-])/g, " ");

	//read stopword
	stopword = fs.readFileSync('stopword.txt', {encoding: 'utf8'});
	stopword = stopword.split(line_character);

	//read connectword
	connectword = fs.readFileSync('connectword.txt', {encoding: 'utf8'});
	connectword = connectword.split(line_character);

	//replace connectword with space
	for(var i = 0; i < connectword.length; i++){
		doc = doc.replace(new RegExp(connectword[i], 'g'), ' ');
	}

	var tree = new PATtree();

	tree.addDocument(doc);
	var SLPs = tree.extractSLP(tftheshold, setheshold);
	var newSLPs = []
	for(var i =0; i < SLPs.length;i++){
		//word length > 1
		if(SLPs[i].sistring.length > 1){
			// not stopword
			if(stopword.indexOf(SLPs[i].sistring) == -1){
				newSLPs.push(SLPs[i])
			}
		}
	}
	SLPs = newSLPs;
	return SLPs;
}

//__main__

/**
	node app.js doc_path slp_path
	doc_path: the doc to extract SLP
	slp_path: the output file of SLP in json
*/

var doc_path = process.argv[2];
var slp_path = process.argv[3];

doc = fs.readFileSync(doc_path, {encoding: 'utf8'});

SLPs = extractSLPs(doc, 2, 0.3);
fs.writeFile(slp_path, JSON.stringify(SLPs), function(err){
	if (err) throw err;
});