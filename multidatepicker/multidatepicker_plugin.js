// anonymous function to wrap around your function to avoid conflict
(function ($) {

    //Attach this new method to jQuery
    $.fn.extend({

        // the multi datepicket plugin 
        multiDateControl: function () {

            // Set the default values, use comma to separate the settings 
            var defaults = {
                minYear: 2011,
                maxYear: 2020,
                startMonth: 0,
                endMonth: 11,
                highlightToday: true,
                dateSeparator: ', '
            };

            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            const selectYear = document.getElementById("year");
            const selectMonth = document.getElementById("month");
            var months = [];
            var years = [];
            var monthAndYear = document.getElementById("monthAndYear");
            var selectedDates = [];
            var disabledDates = [];

            const dictionaryMonth =
                [
                    ["Jan", 0],
                    ["Feb", 1],
                    ["Mar", 2],
                    ["Apr", 3],
                    ["May", 4],
                    ["Jun", 5],
                    ["Jul", 6],
                    ["Aug", 7],
                    ["Sep", 8],
                    ["Oct", 9],
                    ["Nov", 10],
                    ["Dec", 11]
                ];

            var options = $.extend(defaults, options);

            $("#calendar-body tr td").click(function (e) {
                var id = $(this).attr('id');
                if (typeof id !== typeof undefined) {
                    var classes = $(this).attr('class');
                    if (typeof classes === typeof undefined || !classes.includes('bg-info')) {
                        var selectedDate = new Date(id);
                        selectedDates.push((selectedDate.getMonth() + 1).toString() + '/' + selectedDate.getDate().toString() + '/' + selectedDate.getFullYear());
                    }
                    else {
                        var index = selectedDates.indexOf(id);
                        if (index > -1) {
                            selectedDates.splice(index, 1);
                        }
                    }

                    $(this).toggleClass('bg-info');
                }

                var sortedArray = selectedDates.sort((a, b) => {
                    return new Date(a) - new Date(b);
                });

                document.getElementById('selectedValues').value = datesToString(sortedArray);
            });

            return this.each(function () {
                var o = options;

                // code to be inserted here
                // you can access the value like this
                // alert(o.padding);
                
                    var month = currentMonth;
                    var year = currentYear;
                    addMonths(month, o.startMonth, o.endMonth);
                    addYears(year, o.minYear, o.maxYear);

                    let firstDay = (new Date(year, month)).getDay();

                    var tbl = document.querySelector("#calendar-body"); // body of the calendar
                    if (tbl !== null) {
                        // clearing all previous cells
                        tbl.innerHTML = "";
                    }

                    if (monthAndYear !== null) {
                        // filing data about month and in the page via DOM.
                        monthAndYear.innerHTML = months[month] + " " + year;
                    }

                    selectYear.value = year;
                    selectMonth.value = month;

                    // creating all cells
                    let date = 1;
                    for (let i = 0; i <= 6; i++) {
                        // creates a table row
                        let row = document.createElement("tr");

                        if (i < 6) {
                            //creating individual cells, filing them up with data.
                            for (let j = 0; j < 7; j++) {
                                if (i === 0 && j < firstDay) {
                                    cell = document.createElement("td");
                                    cellText = document.createTextNode("");
                                    cell.appendChild(cellText);
                                    row.appendChild(cell);
                                }
                                else if (date > daysInMonth(month, year)) {
                                    break;
                                }
                                else {
                                    cell = document.createElement("td");
                                    cell.id = (month + 1).toString() + '/' + date.toString() + '/' + year.toString();
                                    cell.class = "clickable";

                                    cellText = document.createTextNode(date);

                                    if (highlightToday
                                        && date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                                        cell.classList.add("today-color");
                                    } // color today's date

                                    // set the previous dates to be selected
                                    if (selectedDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                                        cell.classList.add("bg-info");
                                    }

                                    cell.appendChild(cellText);
                                    row.appendChild(cell);
                                    date++;
                                }
                            }
                        }
                        else {
                            cell = document.createElement("td");
                            cell.colSpan = 7;
                            cell.style = 'border: none !important; padding: 6px 0 0 0!important;';
                            var div = document.createElement("div");
                            div.style = 'padding: 5px; border: 1px solid #cecece; width: 100 %;';
                            var resetButton = document.createElement("button");
                            resetButton.classList.add('btn');
                            resetButton.classList.add('btn-primary');
                            resetButton.value = 'Reset';
                            resetButton.onclick = function () { resetCalendar(); };
                            var resetButtonText = document.createTextNode("Reset");
                            resetButton.appendChild(resetButtonText);

                            div.appendChild(resetButton);
                            cell.appendChild(div);
                            row.appendChild(cell);
                        }

                        tbl.appendChild(row); // appending each row into calendar body.
                    }

                    $("#calendar-body tr td").click(function (e) {
                        var id = $(this).attr('id');
                        //if (id != null) {
                        if (typeof id !== typeof undefined) {
                            var classes = $(this).attr('class');
                            if (typeof classes === typeof undefined || !classes.includes('bg-info')) {
                                var selectedDate = new Date(id);
                                selectedDates.push((selectedDate.getMonth() + 1).toString() + '/' + selectedDate.getDate().toString() + '/' + selectedDate.getFullYear());
                            }
                            else {
                                var index = selectedDates.indexOf(id);
                                if (index > -1) {
                                    selectedDates.splice(index, 1);
                                }
                            }

                            $(this).toggleClass('bg-info');
                        }

                        var sortedArray = selectedDates.sort((a, b) => {
                            return new Date(a) - new Date(b);
                        });

                        document.getElementById('selectedValues').value = datesToString(sortedArray);
                    });

                    // var $search = $('#selectedValues');
                    // var $dropBox = $('#cardDiv');
                    // var datesWithFormat = [];
                    // $search.on('blur', function (event) {
                    // }).on('focus', function () {
                    //     debugger;
                    //     $dropBox.show();
                    // });
                //}
                


            });

            // adds the months to the dropdown
            function addMonths(selectedMonth, start, end) {
                var select = selectMonth;

                if (months.length > 0) {
                    return;
                }

                for (var month = start; month <= end; month++) {
                    var monthInstance = dictionaryMonth[month];
                    months.push(monthInstance[0]);
                    select.options[select.options.length] = new Option(monthInstance[0], monthInstance[1], parseInt(monthInstance[1]) === parseInt(selectedMonth));
                }
            }

            // adds the years to the selection dropdown
            // by default it is from 1990 to 2030
            function addYears(selectedYear, minYear, maxYear) {
                if (years.length > 0) {
                    return;
                }
                var select = selectYear;

                for (var year = minYear; year <= maxYear; year++) {
                    years.push(year);
                    select.options[select.options.length] = new Option(year, year, parseInt(year) === parseInt(selectedYear));
                }
            }

            function resetCalendar() {
                // reset all the selected dates
                selectedDates = [];
                $('#calendar-body tr').each(function () {
                    $(this).find('td').each(function () {
                        // $(this) will be the current cell
                        $(this).removeClass('bg-info');
                    });
                });
            }


            function datesToString(dates) {
                return dates.join(dateSeparator);
            }


            // check how many days in a month code from https://dzone.com/articles/determining-number-days-month
            function daysInMonth(iMonth, iYear) {
                return 32 - new Date(iYear, iMonth, 32).getDate();
            }

            function next() {
                currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                currentMonth = (currentMonth + 1) % 12;
                loadControl(currentMonth, currentYear);
            }

            function previous() {
                currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                loadControl(currentMonth, currentYear);
            }

            function change() {
                currentYear = parseInt(selectYear.value);
                currentMonth = parseInt(selectMonth.value);
                loadControl(currentMonth, currentYear);
            }
        }

        //pass jQuery to the function, 
        //So that we will able to use any valid Javascript variable name 
        //to replace "$" SIGN. But, we'll stick to $ (I like dollars :) )		
    })(jQuery);
});