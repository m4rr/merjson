function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var files_count = files.length;
  let result = [];

  for (let i = 0; i < files.length; i++) {
    let f = files[i];
    var reader = new FileReader();

    reader.onload = (function(file) {
      return function(e) {
        let text = e.target.result;
        let json1 = JSON.parse(text);

        if (file.name.includes(".json")) {
          // production file
          document.getElementById('count').innerHTML += json1.length + ", ";

          result.push(clean_up(json1));
        } else {
          // XHR file
          document.getElementById('count').innerHTML += json1.cities.length + ", ";

          result.push(clean_up(json1.cities));
        }

        if (!--files_count) {
          result.push([{"city_id":101175000,"title_en":"Kawthaung","country_ru":"Бирма","country_en":"Burma","title_ru":"Котонг","y":9.983333,"x":98.55}]);

          merjson(result); // when done, invoke callback
        }
      };
    })(f);

    reader.readAsText(f);
  }
}

function clean_up(ary) {
  let obj = ary;

  for (let i = 0; i < obj.length; i++) {
    //obj[i].i = i;  // it was add index
    delete obj[i].i; // now delete if so

    delete obj[i].been_count_msg;
    delete obj[i].want;
    delete obj[i].visited;
    delete obj[i].country_url;
    delete obj[i].been_count;
    delete obj[i].city_url;
    delete obj[i].image_url;

    if (obj[i].country_en === "Ukraine") {
      if (obj[i].title_en !== "Odessa") {
        obj[i].country_en = "Russia"
        obj[i].country_ru = "Россия"
      }
    }

    if (obj[i].title_en === "Mawlamyine" || obj[i].title_en === "Myeik") {
      // replace wrong Burma city to right one
      obj[i].title_ru = "Котонг"
      obj[i].title_en = "Kawthaung"
      obj[i].country_ru = "Бирма"
      obj[i].country_en = "Burma"
      obj[i].x = 98.55
      obj[i].y = 9.983333
      obj[i].city_id = 101175000
    }
  }

  return obj;
}

function merjson(result) {
  //let obj = deepmerge.all(result);
  let obj = result.reduce(function (prev, next) {
    // concat all arrays
    return [...prev, ...next]
  });

  // crazy js way to remove duplicates
  obj = [...new Set(obj.map(JSON.stringify))].map(JSON.parse);

  document.getElementById("t0").innerHTML = JSON.stringify(obj);
  document.getElementById("count").innerHTML += " → " + obj.length;

  download(obj);
}

function download(data) {
  //var data = document.getElementById("t0").value;
  var json = JSON.stringify(data);
  var blob = new Blob([json], {type: "text/plain"});
  var url  = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.download = "cities.json";
  a.href = url;
  a.click();
}
