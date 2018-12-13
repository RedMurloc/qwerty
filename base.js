
//document.addEventListener("DOMContentLoaded", ready);


function getClosest(el, tag) {
    // this is necessary since nodeName is always in upper case
    tag = tag.toUpperCase();
    do {
        if (el.nodeName === tag) {
            // tag name is found! let return it. :)
            return el;
        }
    } while (el = el.parentNode);

    // not found :(
    return null;
}

/* 
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
        console.log(xhr.responseText);
    }

    var depList = 'a b c d'.split(' ');//xhr.responseText.split('\n');

    console.log('-----');
    console.log(depList);
    console.log('-----');
    //print_list_as_butons(depList);

    console.log("pam_pam0");

}*/

var addCode = ''
var addButton = document.getElementById('addButton');
addButton.onclick = function run () {
    console.log("add!");

    if (addCode == ''){
        console.log("pusto");
        addCode =
            '<button id="addButton2" class="button greenButton controlButtons" onclick="alert(\'Добавить источник\')"><span>Добавить источник</span></button>' +
            '<button id="addButton3" class="button greenButton controlButtons" onclick="alert(\'Добавить отчет\')"><span>Добавить отчет</span></button>';
    } else {
        console.log("knopki");
        addCode = '';
    }

    var controlsElement = document.getElementById("controls");
    controlsElement.innerHTML = addCode;

}




function ready(){
    //тут все, что происходит сразу после загрузки страницы.
    // Для включения - расскомментить 2 строку в этом файле.
}


// Drag'N'Drop
 var droppables = new Array();
var itemBeingDragged = null;
var mouseDownPoint = {x: 0, y: 0};

function onDocumentMouseMove(mouseMoveEvent) {
    var point = {x: mouseMoveEvent.pageX, y: mouseMoveEvent.pageY};
    
    // Drag the draggable to this position
    itemBeingDragged.dragTo(point);

    // If there are any droppable elements at this position, notify them
    for (var i = 0; i < droppables.length; i++) {
        if (droppables[i].contains(point) && !droppables[i].isBeingDraggedOver) {
            droppables[i].onDragEnter();
        } else if (!droppables[i].contains(point) && droppables[i].isBeingDraggedOver) {
            droppables[i].onDragExit();
        }
    }
}

function onDocumentMouseUp(mouseUpEvent) {
    // If any droppable is being dragged over, accept the drop
    for (var i = 0; i < droppables.length; i++) {
        if (droppables[i].isBeingDraggedOver) {
            droppables[i].onDragDrop(itemBeingDragged);
        }
    }
    
    // Reset the position of the item being dragged and clear out the document event handlers
    itemBeingDragged.reset(mouseUpEvent);
}

var Draggable = function(elementId) {
    this.init(elementId);
};

Draggable.prototype = {
    init: function(element) {
        if (typeof element === "string") element = document.getElementById(element);
        
        this.element = element;
        this.element.className += "draggable";
        
        var self = this;
        
        this.element.onmousedown = function(mouseDownEvent) {
            this.style.zIndex = "1000";
            
            itemBeingDragged = self;
            
            mouseDownPoint.x = mouseDownEvent.pageX;
            mouseDownPoint.y = mouseDownEvent.pageY;
            
            document.onmousemove = onDocumentMouseMove;
            document.onmouseup = onDocumentMouseUp;
        };
    },
    
    // Called when the mouse is moved (after having been pressed on this element)
    dragTo: function(point) {
        this.element.style.left = (point.x - mouseDownPoint.x) + "px";
        this.element.style.top = (point.y - mouseDownPoint.y) + "px";
    },
    
    // Called when the mouse is lifted (after having been pressed on this element)
    reset: function() {
        this.element.style.zIndex = "";
        this.element.style.left = "";
        this.element.style.top = "";
            
        itemBeingDragged = null;
            
        mouseDownPoint.x = 0;
        mouseDownPoint.y = 0;

        document.onmousemove = null;
        document.onmouseup = null;
    }
};

// customDragDrop is a custom function which will be called when a Draggable is dropped
// on this Droppable; it is passed the Draggable that was dropped
var Droppable = function(element, customDragDrop) {
    this.init(element, customDragDrop);
};

Droppable.prototype = {
    init: function(element, customDragDrop) {
        if (typeof element === "string") element = document.getElementById(element);
        
        this.element = element;
        this.isBeingDraggedOver = false;
        this.customDragDrop = customDragDrop;
        
        droppables.push(this);
    },
    
    // Calculate the top-left coordinate of this element
    position: function() {
        var position = {x: this.element.offsetLeft, y: this.element.offsetTop};
        
        var offsetParent = this.element.offsetParent;
        while (offsetParent) {
            position.x += offsetParent.offsetLeft;
            position.y += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
        }
        
        return position;
    },
    
    // Calculate whether the given coordinate falls within this element's boundaries
    contains: function(point) {
        var topLeft = this.position();
        var bottomRight = {
            x: topLeft.x + this.element.offsetWidth,
            y: topLeft.y + this.element.offsetHeight
        };
        
        return (
            topLeft.x < point.x
            && topLeft.y < point.y
            && point.x < bottomRight.x
            && point.y < bottomRight.y
        );
    },
    
    // Called when an item is dragged into this element
    onDragEnter: function() {
        this.isBeingDraggedOver = true;
        this.element.className += "dragOver";
        console.log("onDragEnter");
    },
    
    // Called when an item is dragged out of this element
    onDragExit: function() {
        this.isBeingDraggedOver = false;
        this.element.className = this.element.className.replace(/\bdragOver\b/, "");
        console.log("onDragExit");
    },
    
    // Called when an item is dropped on this element
    onDragDrop: function(draggable) {
        this.onDragExit();
        this.customDragDrop(draggable);
        console.log("onDragDrop");
    }
};


function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function mapDocumentTouchToMouse() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
}

mapDocumentTouchToMouse();

window.onload = function() {
    var data = 'a b c d'.split(' ');
    console.log("data", data);
    
    var availableMetrics = document.getElementById("available_metrics_list");
    
    for (var i = 0; i < data.length; i++) {
        var liElement = document.createElement("li");
        liElement.appendChild(document.createTextNode(data[i]));
        availableMetrics.appendChild(liElement);
        var liElementDraggable = new Draggable(liElement);
    }
    console.log("data", liElement);
    var availableMetricsDroppable = new Droppable(availableMetrics, function(draggable) {
        if (this.element !== draggable.element.parentNode) {
            this.element.appendChild(draggable.element);
        }
    });
    
    var selectedMetricsDroppable = new Droppable("next_metric", function(draggable) {
        if (this.element.parentNode !== draggable.element.parentNode) {
            this.element.parentNode.insertBefore(draggable.element, this.element);
        }
    });
    
    new Droppable("remove_metric", function(draggable) {
        availableMetricsDroppable.onDragDrop(draggable);
    });
};ы
