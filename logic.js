const search = (match, dataset) => {
    const results = [];
    const regex = new RegExp(match, 'i');
  
    dataset.forEach((e) => {
      if (
        regex.test(e.vendor) ||
        regex.test(e.username) ||
        regex.test(e.password)
      ) {
        results.push(e);
      }
    });
  
    return results;
  };
  
  fetch('./dataset.json')
    .then((res) => res.json())
    .then((data) => {
      const dataset = data;
      const searchValue = document.querySelector('input.search');
      const resultsTable = document.querySelector('tbody.results');
      const noResults = document.querySelector('div.noResults');
      const totalLimit = 250;
  
      const updateResults = (results) => {
        if (results.length == 0) {
          noResults.style.display = '';
          resultsTable.style.display = 'none';
          // hide the table headers when no results are found
          resultsTable.parentElement.style.display = 'none';
          controls.setColor(colorUpdate, 'no-results'); // set color to yellow
        } else if (results.length > totalLimit) {
          noResults.style.display = '';
          if (results.length === 2042) {
            noResults.textContent = `Error: ${results.length} results were found, try being more specific`;
          } else {
            noResults.textContent = `Error: ${results.length} results were found, try being more specific or refine your search`;
          }
          resultsTable.style.display = 'none';
          resultsTable.parentElement.style.display = 'none';
          controls.setColor(colorUpdate, 'too-many-results'); // set color to red
        } else {
          noResults.style.display = 'none';
          resultsTable.style.display = '';
          resultsTable.innerHTML = '';
          results.forEach((r) => {
            const row = resultsTable.insertRow();
            const vendorCell = row.insertCell();
            const usernameCell = row.insertCell();
            const passwordCell = row.insertCell();
            vendorCell.innerHTML = r.vendor;
            usernameCell.innerHTML = r.username;
            passwordCell.innerHTML = r.password;
          });
          // show the table headers when results are found
          resultsTable.parentElement.style.display = '';
          controls.setColor(colorUpdate, 'results-found'); // set color to green
        }
      };
  
      const doSearch = () => {
        const val = searchValue.value.toLowerCase();
        const results = search(val, dataset);
        updateResults(results);
      };
  
      // Hide the "No Results Found" message and table headers when the page loads for the first time
      noResults.style.display = 'none';
      resultsTable.parentElement.style.display = 'none';
  
      searchValue.addEventListener('input', doSearch);
  
      // Color changing logic
      const colorUpdate = document.body;
      const controls = {
        oldColor: '',
        setColor: function(loc, indicator) {
          if (this.oldColor == indicator) return;
          var colorTestRegex = /^color-/i;
  
          loc.classList.forEach(cls => {
            //we cant use class so we use cls instead :>
            if (cls.match(colorTestRegex)) loc.classList.remove(cls);
          });
          loc.classList.add('color-' + indicator);
          this.oldColor = indicator;
        },
        displayResults: function() {
          resultsDiv.style.display = '';
        },
        hideResults: function() {
          resultsDiv.style.display = 'none';
        }
      };
      window.controls = controls;
  
      const searchForm = document.querySelector('form.searchForm');
      const resultsDiv = document.querySelector('div.results');
      const resultsTableHideable = document.querySelector('.results-table');
      const sponsor = document.querySelector('div.sponsor');
  
      const updateResultsWithColor = (results, controls) => {
        if (results.length == 0) {
          noResults.style.display = '';
          resultsTableHideable.classList.add('hide');
          controls.setColor(colorUpdate, 'no-results'); // set color to yellow
        } else if (results.length > totalLimit) {
          noResults.style.display = '';
          resultsTableHideable.classList.add('hide');
          noResults.textContent = `Error: ${results.length} results were found, try being more specific`;
          controls.setColor(colorUpdate, 'too-many-results'); // set color to red
        } else {
          sponsor.classList.add('hide');
          sponsor.style.display = 'none';
          var tableRows = resultsTable.getElementsByTagName('tr');
          for (var x = tableRows.length - 1; x >= 0; x--) {
            resultsTable.removeChild(tableRows[x]);
          }
      
          noResults.style.display = 'none';
          resultsTableHideable.classList.remove('hide');
      
          results.forEach(r => {
            const row = resultsTable.insertRow();
            const vendorCell = row.insertCell();
            const usernameCell = row.insertCell();
            const passwordCell = row.insertCell();
            vendorCell.innerHTML = r.vendor;
            usernameCell.innerHTML = r.username;
            passwordCell.innerHTML = r.password;
          });
      
          controls.setColor(colorUpdate, 'results-found'); // set color to green
        }
      };
      
  
      const doSearchWithColor = (event) => {
        const val = searchValue.value;
      
        if (val != '') {
          controls.displayResults();
          const results = search(val.toLowerCase(), dataset);
          updateResultsWithColor(results, controls); // pass controls object to updateResultsWithColor
          if (results.length === 0) {
            noResults.style.display = '';
            noResults.textContent = 'No results found';
          }
        } else {
          controls.hideResults();
          controls.setColor(colorUpdate, 'no-search');
          noResults.style.display = 'none';
        }
      
        if (event.type == 'submit') event.preventDefault();
      };
  
      // Add fade class to body element to prevent initial fade effect
      document.body.classList.add('fade');
  
      searchForm.addEventListener('submit', doSearchWithColor);
      searchValue.addEventListener('input', doSearchWithColor);
    });