
//document.addEventListener("DOMContentLoaded", ready);


function print_list_as_butons(buttonsList) {

    var code = '';

    for (var i = 0; i < buttonsList.length; i++){
        code += '<button id="buttonList' + i + '" class="draggableElement"><span>' + buttonsList[i] + '</span></button>';
    }

    console.log(code);
    var buttonsListElement = document.getElementById("buttonsListElement");
    buttonsListElement.innerHTML = code;
}



document.getElementById('buttonRun1').onclick = function run () {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/vote', false);

    xhr.send();


    if (xhr.status != 200) {
        // обработать ошибку
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        console.log('BlaBla' + xhr.responseText);
        //output_text.value += xhr.responseText;
        //output.value += "1";
    }

    var depList = xhr.responseText.split('\n');

    console.log('-----');
    console.log(depList);
    console.log('-----');
    print_list_as_butons(depList);

    console.log("pam_pam0");

}

// ДОБАВЛЕНИЕ в базу

/*document.getElementById('buttonAdd').onclick = function run () {
    var depart_name = document.getElementById('inp').value;
    //var formData = new FormData(depart_name);
    var formData = new FormData(document.forms.inp);


    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:8080/ddd' + depart_name, false);
    //xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(formData);

    alert("Отдел " + depart_name + " добавлен!");
    //alert(depart_name);
    console.log("pam_pam0");

}*/

function ready(){
    //тут все, что происходит сразу после загрузки страницы.
    // Для включения - расскомментить 2 строку в этом файле.
}


// Drag'N'Drop

var buttonsList = document.getElementById("buttonsListElement");

var DragManager = new function() {

    /**
     * составной объект для хранения информации о переносе:
     * {
   *   elem - элемент, на котором была зажата мышь
   *   avatar - аватар
   *   downX/downY - координаты, на которых был mousedown
   *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
   * }
     */
    var dragObject = {};

    var self = this;

    function onMouseDown(e) {

        if (e.which != 1) return;

        var elem = e.target.closest('.draggableElement');
        if (!elem) return;

        dragObject.elem = elem;

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
        console.log("smth works!!!");

        return false;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return; // элемент не зажат

        if (!dragObject.avatar) { // если перенос не начат...
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;

            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return;
            }

            // начинаем перенос
            dragObject.avatar = createAvatar(e); // создать аватар
            if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                dragObject = {};
                return;
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;

            startDrag(e); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

        return false;
    }

    function onMouseUp(e) {
        if (dragObject.avatar) { // если перенос идет
            finishDrag(e);
        }

        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        dragObject = {};
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);

        if (!dropElem) {
            self.onDragCancel(dragObject);
        } else {
            self.onDragEnd(dragObject, dropElem);
        }
    }

    function createAvatar(e) {

        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
        var avatar = dragObject.elem;
        var old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        // функция для отмены переноса
        avatar.rollback = function() {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };

        return avatar;
    }

    function startDrag(e) {
        var avatar = dragObject.avatar;

        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function findDroppable(event) {
        // спрячем переносимый элемент
        dragObject.avatar.hidden = true;

        // получить самый вложенный элемент под курсором мыши
        var elem = document.elementFromPoint(event.clientX, event.clientY);

        // показать переносимый элемент обратно
        dragObject.avatar.hidden = false;

        if (elem == null) {
            // такое возможно, если курсор мыши "вылетел" за границу окна
            return null;
        }

        return elem.closest('.droppable');
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;

    this.onDragEnd = function(dragObject, dropElem) {};
    this.onDragCancel = function(dragObject) {};

};


function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}