const App = {   // содержимое приложения
    data() {    // из js в html передаём какие-то данные
        return {
            title: 'Создание карты', // ключ: значение
            mouseInOutMap: false,   // если курсор в области карты, то mouseInOutMap будет true, иначе false
            zoom: 100  // масштаб карты
    }},
    methods: {  // функции

        scrollInMap(event) { // функция выполняющаяся при кручении колёсика мыши
            if (this.mouseInOutMap) {   // если курсор мыши находися в области карты, то
                if(event.deltaY===125) {    // при прокрутке колёсика мыши вниз
                    this.zoom++    // увеличивается масштаб карты
                }
                if(event.deltaY===-125) {   // при прокрутке колёсика мыши вверх
                    this.zoom--    // увеличивается масштаб карты
                }
            }
        },

        createInCanavas() { // функция помогающая работать с Canvas
            var myCanvas = document.querySelector(".map")    // объект Canvas
            var myCtx = myCanvas.getContext("2d")   // контекст myCanvas (2d-объекты)

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

    },
    computed: { // компьютид-функции, которые используются для оптимизации. Должны что-то возвращать
        doubleCountComputed() { // компьютид-функция возвращающая удвоенное кол-во записей
            return this.notes.length * 2
        }
    },
    watch: {    // механизм позволяющий следить за любыми изменениями переменных в data()
        inputValue(value) {  // название метода совпадает с названием переменной, а value - последнее (новое) значение переменной
            if (value.length > 10) {    // Например, если новое значение переменной длиннее 10 символов, то
                this.inputValue = ''    // обнуляем содержимое строки ввода
            }
        }
    }



}

Vue.createApp(App).mount('#app')  // создаём приложение     // привязка идёт по id="app"