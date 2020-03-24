const listedCountries = {
  'Belgium': 'Belgium',
  'Canada': 'Canada',
  'China': 'China',
  'Denmark': 'Denmark',
  'Egypt': 'Egypt',
  'Finland': 'Finland',
  'France': 'France',
  'Germany': 'Germany',
  'Greece': 'Greece',
  'Iceland': 'Iceland',
  'Italy': 'Italy',
  'Netherlands': 'Netherlands',
  'New Zealand': 'New Zealand',
  'Poland': 'Republic of Poland',
  'Russia': 'Russia',
  'Portugal': 'Portugal',
  'Spain': 'Spain',
  'Sweden': 'Sweden',
  'Switserland': 'Switserland',
  'Turkey': 'Turkey',
  'United Kingdom': 'United Kingdom',
  'US': 'United States of America',
}
const dataUrl = 'https://pomber.github.io/covid19/timeseries.json';
let data = {};

$(document).ready(function () {
  console.info('Corona race script started executing.');


  /* functions */

  function getDataPromise(url) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        success: resolve,
        error: reject
      })
    })
  }

  function parseData(input) {
    console.log('Parsing input data...');
    let output = {'racers': {}, 'max': 0};
    for (let [key, value] of Object.entries(input)) {
      if (key in listedCountries) {
        output.racers[listedCountries[key]] = value;
        for (i = 0; i < value.length; i++) {
          output.max = (value[i].confirmed > output.max ? value[i].confirmed : output.max);
        }

      }
    }

    console.log('✅ Parsed input data!');
    return output;
  }

  function renderData(input) {
    console.log('Rendering input data...');
    for (let [key, value] of Object.entries(input.racers)) {
      let racer = $('<div class="racer">');
      racer.css('padding-left', ((value[value.length - 1].confirmed / input.max) * 100) + '%');
      racer.attr('country', key);

      let flag = $('<img class="flag">');
      flag.attr('src', 'flag/' + key.toLowerCase().replace(/ /g, '-') + '.svg');
      flag.attr('alt', 'Flag of ' + key);
      racer.append(flag);

      let count = $('<p></p>');
      count.append(value[value.length - 1].confirmed);
      racer.append(count);

      $('#field').append(racer);
    }

    console.log('✅ Rendered input data!');
  }


  /* things */
  console.log('cloRetrieving input data...');
  getDataPromise(dataUrl)
    .then(result => {
      console.log('✅ Retrieved input data!');
      data = parseData(result);
      renderData(data);
    })
    .catch(result => {
      console.error('Retrieving input data failed: ' + result);
      data = {};
    })
})
;
