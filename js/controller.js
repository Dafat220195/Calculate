let controller = (function(budgetCtrl, uiCtrl) {
    
    
    let setupEventListeners = function () {
        let DOM = uiCtrl.getDomstrings();
        document.querySelector(DOM.form).addEventListener("submit", ctrlAddItem);

        //Клик по таблице с доходами и расходами
        document.querySelector(DOM.budgetTable).addEventListener("click", ctrlDeleteItem)
    }
    //обновляем проценты у каждой записи
    function updatePercentages () {
        //Посчитаем проценты для каждой записи expense
        budgetCtrl.calculatePercentages();
        
        //Получаем данные по процентам из модели
        let idsAndPercents =  budgetCtrl.getAllIdsAndPercentages();
        budgetCtrl.test();
        //Обновляем наш UI с новыми процентами
        uiCtrl.updateItemPercentages(idsAndPercents)
    }
    // Функция срабатывает при отправке формы
    //Функция добавления элемента
    function ctrlAddItem (event) {
        event.preventDefault();
        
        
       
        //1.Получать данные с формы
        let input = uiCtrl.getInput();
        

        //проверка что поля не пустые
        if (input. description != "" && !isNaN(input.value) && input.value>0) {
            //2.Добавить полученные данные в модель
        let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3.Добавить запись в UI
        
        uiCtrl.renderListItem(newItem, input.type);
        uiCtrl.clearFields();
        generateTestData.init();
        
        //4.Посчитать Бюджет
        updateBudget ();

        //обновляем проценты у каждой записи
        updatePercentages();

        }

        


    }
    //Функция удаления элемента
    function ctrlDeleteItem (event) {
        let itemID, splitID, type, ID;

        if (event.target.closest(".item__remove") ) {
            
            //Найти ID  записи, которую надо удалить
            itemID = event.target.closest("li.budget-list__item").id //inc-0
            splitID = itemID.split("-"); // inc-0 => ['inc, "0"]
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //Провести удаление из модели
            budgetCtrl.deleteItem(type, ID);

            //Удаление из шаблона
            uiCtrl.deleteListItem (itemID);

            // Посчитать Бюджет
            updateBudget ();
            //обновляем проценты у каждой записи
            updatePercentages ();

        }
    }
    //Функция обновления бюджета
    function updateBudget () {
    //1. Рассчитать бюджет в модели
    budgetCtrl.calculateBudget();
    //2. Получить рассчитанный бюджет из модели
    budgetObj = budgetCtrl.getBudget();
    //3. Отобразить в шаблоне
    uiCtrl.updateBudget(budgetObj);
    


    }

    return {
        init:function (){
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0,
            });

        }
    }
  
})(modelController, modelView);

controller.init();