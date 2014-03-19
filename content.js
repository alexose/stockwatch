// StockWatch
//
// The strategy here is to index all the DOM text nodes into a string,
// then search that string for ticker symbols.  I believe this is faster
// than jQuery's approach, but I'm not 100% sure.

var dataURL = chrome.extension.getURL('data/companylist.csv');

function load(){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', dataURL, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            parse(xhr.responseText);
        }
    };
    xhr.send();

    // Turn CSV into array
    function parse(csv){
        var arr = CSVToArray(csv);

        // Remove first and last rows
        arr.shift().pop();

        // Remove irrelevant fields
        arr = arr.map(function(d){
            return [d[0], d[1]];
        });

        console.log(arr);
    }
}
load();

// Testing different text searches
var defaults = ['Google', 'JavaScript', 'Object'];

function allTests(num){

    num = num || 1;

    for (var i=1; i<=num; i++){
        test(i, 10000);
    }

    return;
}

function search1(terms){
    terms = terms || defaults;

    var results = [];

    for (var i in terms){
        var result = match(terms[i]);
        results.push(result);
    }

    return results;

    function match(term){

      var str = index(),
          matches = [];

      if (str.indexOf(term) !== -1){
          matches.push(term);
      }

      return matches;
    }

}

function index(){
  if (!document.nodeIndex){
      var nodes = document.evaluate('//text()', document.body),
          str = "",
          idx = 0;

      while(true){
          var node = nodes.iterateNext();

          if (!node){
              break;
          }

          str += node.textContext;

          idx++;
      }

      document.nodeIndex = str;
  }

  return document.nodeIndex;
}


// via http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
function CSVToArray( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");

    var objPattern = new RegExp((
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
      );

    var arrData = [[]],
        arrMatches = null;

    while (arrMatches = objPattern.exec(strData)){

      var strMatchedDelimiter = arrMatches[1];

      if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
        arrData.push([]);
      }

      var strMatchedValue = arrMatches[2] ? arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"" ) : arrMatches[3];

      arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    return( arrData );
}
