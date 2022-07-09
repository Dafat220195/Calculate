let modelView = (function() {
    //Создадим DOM для используемых селекторов
    let DOMstrings = {
        inputType: "#input__type",
        inputDescription: "#input__description",
        inputValue: "#input__value",
        form : "#budget-form",
        incomeContainer: "#income__list",
        expenseContainer: "#expenses__list",
        budgetLabel:"#budget-value",
        incomeLabel:"#income-label",
        expensesLabel:"#expense-label",
        expensesPercentLabel:"#expense-percent-label",
        budgetTable: "#budget-table",
        monthLabel:"#month",
        yearLabel:"#year",

    }
    //Функция получения данных из ввода
    function getInput() {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description:document.querySelector(DOMstrings.inputDescription).value,
            value:document.querySelector(DOMstrings.inputValue).value
        }
    }
    //Функция форматирования больших чисел в формате ХХХ,ХХХ.ХХ
    function formatNumber (num, type) {
        let numSplit, int, dec, newInt, resultNumber;
        // Добавлять + --или - в зависимости от типа числа
        //2 знака после точки  50 => 50.00
        
        //Убираем знак "-" у отрицательных чисел
        num = Math.abs(num);
        //Приводим к 2-м цифрам после точки
        num = num.toFixed(2);

        //Разделим число на части
        numSplit = num.split('.');
        //Определяем целую часть
        int = numSplit[0];
        //Определяем десятые от исходной строки
        dec = numSplit[1];

        //Исходя из длины числа мы делим его на части по 3 цифры 
        //Проставляем запятые после каждого третьего числа
        //Если длина номера больше чем 3 цирфы, значит надо ставить запятые
        if (int.length>3) {
            newInt = "";
            console.log("int.length", int.length);

            for(let i=0;i< int.length/3;i++) {
                console.log("for", i);

                newInt = 
                    //добавляем запятую каждые 3 числа
                    "," +
                    //вырезанный кусок из исходной строки
                    int.substring(int.length-3*(i+1), int.length -3*i) +
                    //онец строки, правая часть
                    newInt;
                console.log(newInt);

            }

            console.log(newInt);
            //Убираем запятую в начале числа
            if (newInt[0] ===",") {
                newInt = newInt.substring(1);
            }


        } else if (int === "0") {
            //Если исходное число равно 0 , то записывааем в новую строку Ноль
            newInt = "0";

            //Если исходное число имеет 3 и более символов
        } else {
            newInt = int;
        }

        resultNumber = newInt + "." + dec;

        if (type === "exp") {
            resultNumber ="- " + resultNumber;
        } else if(type === "inc") {
            resultNumber ="+ " + resultNumber;
        }
        return resultNumber;
    }
    //Функция рендеринга элементов расхода и дохода
    function renderListItem (obj, type) {
        
        let containerElement, html, newHtml;
        if(type === "inc") {
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">%value%</div>
                            <button class="item__remove">
                            <img src="./img/circle-green.svg" alt="delete"/>
                            </button>
                        </div>
                    </li>`;
        } else {
            containerElement = DOMstrings.expenseContainer;
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">
                            %value%
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                    15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`;
        }
        
        html = html.replace("%id%", obj.id);
        newHtml = html.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value), type);
        
        document.querySelector(containerElement).insertAdjacentHTML("beforeend", newHtml)


    }

    function clearFields () {
        let inputDesc, inputVal;
        inputDesc = document.querySelector(DOMstrings.inputDescription);
        inputVal = document.querySelector(DOMstrings.inputValue);
        inputDesc.value = "";
        inputDesc.focus();
        inputVal.value = "";
    }
    //Функция обнолвение данных бюджета
    function updateBudget (obj) {
        let type;
        
        if(obj.budget>0) {
            type = "inc";
        } else {
            type = "exp";
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");
        if(obj.percentage > 0) {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = obj.percentage;
        } else {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = "--";
        }
        
       
        
        
        
        
        /*
        budgetLabel:"#budget-value",
        incomeLabel:"#income-label",
        expensesLabel:"#expense-label",
        expensesPercentLabel:"#expense-percent-label",
        
        
        
        budget:data.budget,
        totalInc:data.totals.inc,
        totalExp:data.totals.exp,
        percentage:data.percentage,*/
    }
    //Функция удаление элемента
    function deleteListItem (itemID) {
        document.getElementById(itemID).remove();
    }
    //Функция обновление процентов в расходах
    function updateItemPercentages (items) {
        items.forEach(function (item){
            //[0 , 1]
            //находим элемент с процентами
           let el = document.getElementById(`exp-${item[0]}`).querySelector(".item__percent");
           console.log("el", el);
           

           if(item[1] >= 0) {
                //Если ест, то показываем блок с процентами
                el.parentElement.style.display = 'block';
                //Меняем контент внутри бейджа с процентами
                el.textContent = `${item[1]}%`;
           } else {
                //Если нет, то скрываем бейдж с процентами
                el.parentElement.style.display = 'none';
           }


        })
    }

    //Функция выведения даты
    function displayMonth () {
        let now, year, month;
        now = new Date();
        year = now.getFullYear(); //2020
        month = now.getMonth(); // Апрель => 3

        monthArr = [
            'Январь','Февраль','Март',
            'Апрель','Май','Июнь',
            'Июль','Август','Сентябрь',
            'Октябрь','Ноябрь','Декабрь'
        ];
        //Записываем в переменную название месяца по его индексу
        month = monthArr[month];
        //Прописываем данные года и месяца в UI
        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;

    }
    //Возвращение функция наружу
    return {
        getInput: getInput,
        renderListItem : renderListItem,
        clearFields: clearFields,
        updateBudget:updateBudget,
        deleteListItem:deleteListItem,
        updateItemPercentages:updateItemPercentages,
        displayMonth:displayMonth,
        getDomstrings: function () {
            return DOMstrings;
        }
    }


    
})();