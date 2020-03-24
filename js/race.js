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
  'India': 'India',
  'Indonesia': 'Indonesia',
  'Italy': 'Italy',
  'Netherlands': 'Netherlands',
  'New Zealand': 'New Zealand',
  'Norway': 'Norway',
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
let raw = {}; /* for debug */

$(document).ready(function () {
  console.info('Corona race script started executing.');


  /* functions */

  function fancyNumber(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

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
    let output = {'racers': {}, 'max': 0, 'total': {'confirmed': 0, 'dead': 0, 'recovered': 0}};
    for (let [key, value] of Object.entries(input)) {
      output.total.confirmed += value[value.length - 1].confirmed;
      output.total.dead += value[value.length - 1].deaths;
      output.total.recovered += value[value.length - 1].recovered;

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
      count.append(fancyNumber(value[value.length - 1].confirmed));
      racer.append(count);

      $('#field').append(racer);
    }

    $('#stats').text('Total confirmed: ' + fancyNumber(input.total.confirmed) + ' / dead: ' + fancyNumber(input.total.dead) + ' / recovered: ' + fancyNumber(input.total.recovered));

    console.log('✅ Rendered input data!');
  }


  /* things */
  console.log('cloRetrieving input data...');
  getDataPromise(dataUrl)
    .then(result => {
      console.log('✅ Retrieved input data!');
      raw = result;
      data = parseData(result);
      renderData(data);
    })
    .catch(result => {
      console.error('Retrieving input data failed: ' + result);
      data = {};
    })
})
;
