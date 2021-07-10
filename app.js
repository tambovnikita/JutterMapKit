const App = {   // содержимое приложения
    data() {    // из js в html передаём какие-то данные
        return {
            title: 'Создание карты', // ключ: значение
            mouseInOutMap: false,   // если курсор в области карты, то mouseInOutMap будет true, иначе false
            myZoomWidth: 10000,  // ширина области карты
            myZoomHeight: 10000,  // высота области карты
            transformMap: 1,
            creationMode: null, // режим создания (house, road, grass...)
            classMap: 'map',    // режим карты (map или map.active)
            listPoints: [], // массив с координатами [X, Y] точек
            countPoints: 0, // кол-во точек
            myCanvas: null, // объект Canvas
            myCtx: null, // контекст myCanvas (2d-объекты)
            myJson: {   // пример рабочего JSON
                "nameWorkspace": "myExample",
                "idWorkspace": "1",
                "houses": [{
                    "nameHouse": null,
                    "idHouse": null,
                    "areaHouse": {
                        "xArea": null,
                        "yArea": null,
                        "widthArea": null,
                        "heightArea": null
                    },
                    "coordinatesHouse": []
                }],
                "roads": [{
                    "nameRoad": null,
                    "idRoad": null,
                    "areaRoad": {
                        "xArea": null,
                        "yArea": null,
                        "widthArea": null,
                        "heightArea": null
                    },
                    "coordinatesRoad": []
                }],
                "grasses": [{
                    "nameGrass": null,
                    "idGrass": null,
                    "areaGrass": {
                        "xArea": null,
                        "yArea": null,
                        "widthArea": null,
                        "heightArea": null
                    },
                    "coordinatesGrass": []
                }]
            }
    }},
    methods: {  // функции

        newMap() {  // функция создающая объект Canvas (активирующая процесс построения)
            this.classMap = 'map active'    // добавляем фон, когда начинается создание карты
            this.myCanvas = document.querySelector(".map")   // объект Canvas
            this.myCtx = this.myCanvas.getContext("2d")   // контекст myCanvas (2d-объекты)
            this.myCtx.canvas.width = this.myZoomWidth // ширина расширения карты = ширине области карты
            this.myCtx.canvas.height = this.myZoomHeight   // высота расширения карты = высоте области карты
        },

        scrollInMap(event) { // функция выполняющаяся при кручении колёсика мыши

            if (this.mouseInOutMap) {   // если курсор мыши находися в области карты, то
                if(event.deltaY===125) {    // при прокрутке колёсика мыши вниз
                    if (this.transformMap <= 2) {this.transformMap+=0.05}
                    //this.myZoomWidth = Math.round(this.myZoomWidth * 1.1)   // увеличивается ширина карты
                    //this.myZoomHeight = Math.round(this.myZoomHeight * 1.1)  // увеличивается высота карты
                    //this.myCtx.canvas.width = Math.round(this.myCtx.canvas.width * 1.1)    // увеличивается ширина расширения карты
                    //this.myCtx.canvas.height = Math.round(this.myCtx.canvas.height * 1.1)    // увеличивается высота расширения карты
                }
                if(event.deltaY===-125) {   // при прокрутке колёсика мыши вверх
                    if (this.transformMap >= 0.05) {this.transformMap-=0.05}
                    //this.myZoomWidth = Math.round(this.myZoomWidth / 1.1)   // уменьшается ширина карты
                    //this.myZoomHeight = Math.round(this.myZoomHeight / 1.1)  // уменьшается высота карты
                    //this.myCtx.canvas.width = Math.round(this.myCtx.canvas.width / 1.1)    // уменьшается ширина расширения карты
                    //this.myCtx.canvas.height = Math.round(this.myCtx.canvas.height / 1.1)    // уменьшается высота расширения карты
                }

                // Заливка здания
                this.myCtx.beginPath()   // новая фигура с новыми настройками
                this.myCtx.strokeStyle = "black" // цвет линий
                this.myCtx.fillStyle = "black" // цвет заливки точек
                this.myCtx.lineWidth = "2"   // ширина линий
                this.myCtx.globalAlpha = 1;  // устанавливаем значение прозрачности
                this.myCtx.moveTo(this.listPoints[0][0], this.listPoints[0][1])
                for (var i = 0; i < (this.listPoints.length-1); i++) {
                    this.myCtx.lineTo(this.listPoints[i+1][0], this.listPoints[i+1][1])
                    if ((this.listPoints.length-1) === i+1) {
                        this.myCtx.lineTo(this.listPoints[0][0], this.listPoints[0][1])
                        this.myCtx.globalAlpha = 0.2;  // устанавливаем значение прозрачности
                        this.myCtx.closePath()   // дорисовывает фигуру (соединяет концы)
                        this.myCtx.stroke()  // отрисовываем треугольник
                        this.myCtx.fill()    // заливка треугольника последним цветом
                    }
                }
            }
        },

        creationModes(event) {    // режимы создания (house, road, grass...) и активации кнопок (css)
            switch (event.target.id) {  // рассматриваем несколько вариантов (определяем какая кнопка была нажата)
                case 'btnHouse':    // если была нажата кнопка для создания house
                    // и если режим создания ещё не задан или равен 'road' или равен 'grass', то
                    if (this.creationMode === null || this.creationMode === 'road' || this.creationMode === 'grass') {
                        if (this.creationMode === 'road') { // если был режим создания 'road', то
                            // убираем активное состояние кнопки 'road' (css)
                            document.getElementById("btnRoad").classList.remove("active")
                        }
                        if (this.creationMode === 'grass') {    // если был режим создания 'grass', то
                            // убираем активное состояние кнопки 'grass' (css)
                            document.getElementById("btnGrass").classList.remove("active")
                        }
                        this.creationMode = 'house' // режим создания теперь будет 'house'
                        event.target.classList.add("active")    // и у кнопки 'house' будет активированный режим
                    }
                    else {  // если кнопка 'house' уже была активирована, то
                        this.creationMode = null    // онулируем режим создания
                        event.target.classList.remove("active") // и убираем активированное состояние кнопки 'house' (css)
                    }
                    break   // завершаем case

                case 'btnRoad': // если была нажата кнопка для создания road
                    // и если режим создания ещё не задан или равен 'house' или равен 'grass', то
                    if (this.creationMode === null || this.creationMode === 'house' || this.creationMode === 'grass') {
                        if (this.creationMode === 'house') {    // если был режим создания 'house', то
                            // убираем активное состояние кнопки 'house' (css)
                            document.getElementById("btnHouse").classList.remove("active")
                        }
                        if (this.creationMode === 'grass') {    // если был режим создания 'grass', то
                            // убираем активное состояние кнопки 'grass' (css)
                            document.getElementById("btnGrass").classList.remove("active")
                        }
                        this.creationMode = 'road'  // режим создания теперь будет 'road'
                        event.target.classList.add("active")    // и у кнопки 'road' будет активированный режим

                    }
                    else {  // если кнопка 'road' уже была активирована, то
                        this.creationMode = null    // онулируем режим создания
                        event.target.classList.remove("active") // и убираем активированное состояние кнопки 'road' (css)
                    }
                    break   // завершаем case

                case 'btnGrass':    // если была нажата кнопка для создания grass
                    // и если режим создания ещё не задан или равен 'house' или равен 'road', то
                    if (this.creationMode === null || this.creationMode === 'house' || this.creationMode === 'road') {
                        if (this.creationMode === 'house') {    // если был режим создания 'house', то
                            // убираем активное состояние кнопки 'house' (css)
                            document.getElementById("btnHouse").classList.remove("active")
                        }
                        if (this.creationMode === 'road') { // если был режим создания 'road', то
                            // убираем активное состояние кнопки 'road' (css)
                            document.getElementById("btnRoad").classList.remove("active")
                        }
                        this.creationMode = 'grass' // режим создания теперь будет 'grass'
                        event.target.classList.add("active")    // и у кнопки 'grass' будет активированный режим

                    }
                    else {  // если кнопка 'grass' уже была активирована, то
                        this.creationMode = null    // онулируем режим создания
                        event.target.classList.remove("active") // и убираем активированное состояние кнопки 'grass' (css)
                    }
                    break   // завершаем case
            }
        },

        createInCanvas(moveEvent) { // редактор карты на Canvas

            if (this.creationMode === 'house') {    // если режим создания 'house'

                this.myCtx.strokeStyle = "black" // цвет линий
                this.myCtx.fillStyle = "black" // цвет заливки точек
                this.myCtx.lineWidth = "1"   // ширина линий

                if (this.listPoints.length !== 0) { // если была создана хоть одна координата дома

                    if (this.listPoints.length > 2) {   // если было создано больше двух координат здания
                        // если был клик мыши в радиусе 5 пикселей от самой первой координаты здания, то
                        if (Math.abs(this.listPoints[0][0]-moveEvent.offsetX) < 5 && Math.abs(this.listPoints[0][1]-moveEvent.offsetY) < 5) {
                            this.myCtx.lineTo(this.listPoints[0][0], this.listPoints[0][1])  // проводим линию в первую точку
                            this.myCtx.stroke()  // отрисовываем линию
                            this.myCtx.closePath()   // дорисовывает фигуру (соединяет концы)

                            // Заливка здания
                            this.myCtx.beginPath()   // новая фигура с новыми настройками
                            this.myCtx.strokeStyle = "black" // цвет линий
                            this.myCtx.fillStyle = "black" // цвет заливки точек
                            this.myCtx.lineWidth = "0"   // ширина линий
                            this.myCtx.globalAlpha = 0.2;  // устанавливаем значение прозрачности
                            this.myCtx.moveTo(this.listPoints[0][0], this.listPoints[0][1]) // курсор в первой координате
                            for (var i = 0; i < (this.listPoints.length-1); i++) {  // проходимся по списку с координатами
                                this.myCtx.lineTo(this.listPoints[i+1][0], this.listPoints[i+1][1]) // проводим линии
                                if ((this.listPoints.length-1) === i+1) {   // условие для последней линии
                                    this.myCtx.lineTo(this.listPoints[0][0], this.listPoints[0][1]) // проводим последнюю линию
                                    this.myCtx.closePath()   // дорисовывает фигуру (соединяет концы)
                                    this.myCtx.stroke()  // отрисовываем многоугольник (здание)
                                    this.myCtx.fill()    // заливка многоугольника (здания) последним цветом
                                }
                            }
                            console.log("Здание готово")
                            console.log(this.listPoints)
                            this.myJson.houses[0].coordinatesHouse.push(this.listPoints)    // заносим координаты здания в JSON
                            console.log(this.myJson)    // смотрим на JSON
                            //listPoints = []
                            //this.countPoints = 0
                        }
                    }
                    if (this.listPoints.length >= 1) {
                        this.listPoints.push([moveEvent.offsetX, moveEvent.offsetY]) // текущие координаты X и Y курсора заносим в массив
                        this.countPoints++   // увеличиваем кол-во точек

                        this.myCtx.beginPath()   // новая фигура с новыми настройками
                        // (X-центр, Y-цента, радиус, начальный угол, конечный угол, true - против часовой стрелки, false - по часовой стрелке)
                        this.myCtx.arc(this.listPoints[this.countPoints-1][0], this.listPoints[this.countPoints-1][1], 3, 0, 2 * Math.PI, false)
                        this.myCtx.fill()    // заливка круга последним цветом
                        if (this.countPoints-2 >= 0) {
                            this.myCtx.moveTo(this.listPoints[this.countPoints-2][0], this.listPoints[this.countPoints-2][1])    // начало в предыдущей точке
                        }
                        this.myCtx.lineTo(this.listPoints[this.countPoints-1][0], this.listPoints[this.countPoints-1][1])  // проводим линию, соединяющую две точки
                        this.myCtx.stroke()  // отрисовываем точку и линию
                    }
                }
                else {
                    this.listPoints.push([moveEvent.offsetX, moveEvent.offsetY]) // текущие координаты X и Y курсора заносим в массив
                    this.countPoints++   // увеличиваем кол-во точек

                    this.myCtx.beginPath()   // новая фигура с новыми настройками
                    this.myCtx.arc(this.listPoints[this.countPoints-1][0], this.listPoints[this.countPoints-1][1], 3, 0, 2 * Math.PI, false)
                    this.myCtx.fill()    // заливка круга последним цветом
                    this.myCtx.stroke()  // отрисовываем точку и линию
                }
            }
        },



        /*
        practicCanavas() { // функция помогающая работать с Canvas


            myCtx.globalAlpha = 0.2;  // устанавливаем значение прозрачности

            myCtx.fillStyle = "white" // цвет заливки прямоугольника
            myCtx.fillRect(0, 0, 200, 50) // обычный прямоугольник
            myCtx.fillStyle = "blue" // цвет заливки прямоугольника
            myCtx.fillRect(0, 50, 200, 50) // обычный прямоугольник
            myCtx.fillStyle = "red" // цвет заливки прямоугольника
            myCtx.fillRect(0, 100, 200, 50) // обычный прямоугольник

            myCtx.clearRect(0,0, 400, 200)  // стирает всё в заданном прямоугольнике

            // Построение прямоугольника
            myCtx.strokeStyle = "green" // цвет прямоугольника
            myCtx.lineWidth = "10"  // ширина обводки
            myCtx.rect(50, 10, 100, 100) // область прямоугольника
            myCtx.stroke()  // рисуем область прямоугольника
            myCtx.fill()    // заливка последним цветом

            // Построение линии
            myCtx.beginPath()   // новая фигура с новыми настройками
            myCtx.lineWidth = "7"   // ширина линии
            myCtx.moveTo(100, 50)   // определяем расположение курсора
            myCtx.lineTo(150, 150)  // проводим линию
            myCtx.stroke()  // отрисовываем линию

            myCtx.beginPath()   // новая фигура с новыми настройками
            myCtx.moveTo(200, 50)   // определяем расположение курсора
            myCtx.lineTo(300, 50)  // проводим линию
            myCtx.lineCap = "round" // скругление концов линии
            myCtx.lineCap = "square" // оквадрачивание концов линии
            myCtx.lineCap = "butt"  // концы линии обрезаются (по-умолчанию)
            myCtx.stroke()  // отрисовываем линию

            myCtx.clearRect(0,0, 400, 200)  // стирает всё в заданном прямоугольнике

            // Построение треугольника
            myCtx.beginPath()   // новая фигура с новыми настройками
            myCtx.lineCap = "round"  // концы линии округляются
            myCtx.moveTo(50, 150)   // определяем расположение курсора
            myCtx.strokeStyle = "black" // цвет линий
            // проводим линии
            myCtx.lineTo(150, 50)
            myCtx.lineTo(200, 150)
            myCtx.fillStyle = "grey"    // меняем цвет заливки
            myCtx.closePath()   // дорисовывает фигуру (соединяет концы)
            myCtx.stroke()  // отрисовываем треугольник
            myCtx.fill()    // заливка треугольника последним цветом

            myCtx.clearRect(0,0, 400, 200)  // стирает всё в заданном прямоугольнике

            // Рисование
            myCtx.beginPath()   // новая фигура с новыми настройками
            var myColor = 'black'   // цвет, который выбирает пользователь
            document.querySelector("#color").oninput = function () {    // когда пользователь выбрал цвет
                myColor = this.value  // присваиваем переменной myColor новый цвет
            }
            myCanvas.onmousedown = function (downEvent) {    // отслеживаем когда на мыши зажата клавиша
                myCanvas.onmousemove = function (moveEvent) {   // отслеживаем движение курсора внутри окна Canvas
                    var x = moveEvent.offsetX  // координата X курсора
                    var y = moveEvent.offsetY  // координата Y курсора
                    myCtx.fillStyle = myColor // цвет заливки прямоугольника
                    myCtx.fillRect(x, y, 5, 5)    // рисуем прямоугольники
                    myCtx.fill()    // заливка треугольника последним цветом
                }
                myCanvas.onmouseup = function () {  // когда отпускаем клавишу мыши
                    myCanvas.onmousemove = null // событие движения (функция myCanvas.onmousemove) отменяется
                }
            }

            myCtx.clearRect(0,0, 400, 200)  // стирает всё в заданном прямоугольнике

            // Круги и дуги
            myCtx.beginPath()   // новая фигура с новыми настройками
            var pi = Math.PI  // число Пи (3.1415...)
            // (X-центр, Y-цента, радиус, начальный угол, конечный угол, true - против часовой стрелки, false - по часовой стрелке)
            myCtx.arc(150, 100, 75, 0, 2*pi, true)
            myCtx.stroke()  // отрисовываем дугу
            myCtx.fill()    // заливка круга последним цветом

            myCtx.clearRect(0,0, 400, 200)  // стирает всё в заданном прямоугольнике

            // Кривые
            myCtx.beginPath()   // новая фигура с новыми настройками
            myCtx.moveTo(50, 80)    // определяем расположение курсора
            // (X-искривления, Y-искривления, X-конца, Y-конца)
            myCtx.lineWidth = "3"   // ширина линии
            myCtx.lineCap = "round" // скругление концов линии
            myCtx.quadraticCurveTo(100, 180, 300, 50)
            myCtx.quadraticCurveTo(80, 250, 50, 80)
            myCtx.fillStyle = "black"   // цвет заливки
            myCtx.stroke()  // отрисовываем дугу
            myCtx.fill()    // заливка круга последним цветом

        }

        */

    }

}

Vue.createApp(App).mount('#app')  // создаём приложение     // привязка идёт по id="app"