let modelController = (function() {
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    //Создаём свойство прототипа по которму будет доступен пересчет процентов
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    }
    //Метод возвращения значение процентов
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
//Функция добавления элемента
function addItem (type, desc, val) {
    let newItem, ID;
    ID = 0;
    //--генерируем ID
    //ID будет равен последний iD + 1

    if (data.allItems[type].length>0) {
        let lastindex = data.allItems[type].length-1;
        ID = data.allItems[type][lastindex].id+1;
    } else {
        ID = 0;
    }
    

    //--В зависимости от типа записи используем соответствующий конструктор и создаём новый объект
    if (type === "inc") {
        newItem = new Income(ID, desc, parseFloat(val));
    } else if (type === "exp") {
        newItem = new Expense(ID, desc, parseFloat(val));
    }
    //--записываем наш объект в структуру данных
    data.allItems[type].push(newItem)
    
    //--вовзращаем новый объект
    return newItem;
    
    
}
//Функция удаления элемента
function deleteItem (type, ID) {
    //inc, 4

    //data.allItems[type]
    //data.allItems[inc]
    // index = 2
    
    //1. Найти запись по ID в массиве с доходмаи или расходами. 
    let ids = data.allItems[type].map(function (item){
        return item.id;
    });
    
    //Находим index записи
    index = ids.indexOf(ID);

    
    // Удалить найденную запись из массива по индексу
    if (index != -1) {
        data.allItems[type].splice(index, 1);
    }
    

    

}
//Функция возвращающая все доходы или расходы
function calculateTotalSum (type) {
    let sum = 0;

    data.allItems[type].forEach(function (item) {
        sum = sum + item.value;
    });
    return sum;
}
//Функция для расчета бюджета
function calculateBudget () {
    //Посчитать все доходы
    data.totals.inc = calculateTotalSum ("inc");
    //Посчитать все расходы
    data.totals.exp = calculateTotalSum ("exp");
    //Посчитать общий бюджет (доход-расход)
    data.budget = data.totals.inc - data.totals.exp;
    //Посчитать процент для расходов
    if (data.totals.inc>0) {
        data.percentage = Math.round((data.totals.exp/data.totals.inc)* 100);
        
    } else {
        data.percentage = -1;
    }
    
    
}
//Функция получения бюджета
function getBudget () {
    return {
        budget:data.budget,
        totalInc:data.totals.inc,
        totalExp:data.totals.exp,
        percentage:data.percentage,
    }
}
//Функция просчета процентов для каждого элемента
function calculatePercentages () {
    data.allItems.exp.forEach(function (item) {
        item.calcPercentage(data.totals.inc);
    })
}
//Функция получения ID и процентов
function getAllIdsAndPercentages () {
    let allPerc = data.allItems.exp.map(function (item) {
        return [item.id, item.getPercentage()]
    });
    
return allPerc;
    

    //[[0, 15],[1, 23]]

}

//--база хранения всех данных
let data = {
    allItems: {
        inc: [],
        exp: []
    },
    totals: {
        inc: 0,
        exp: 0
    },
    budget: 0,
    percentage: -1
}
//--// база хранения всех данных
//возвращение функций
return {
    addItem : addItem,
    calculateBudget : calculateBudget,
    getBudget : getBudget,
    deleteItem:deleteItem,
    calculatePercentages:calculatePercentages,
    getAllIdsAndPercentages:getAllIdsAndPercentages,

    test: function (){
        console.log(data);
        
    }
}

})();