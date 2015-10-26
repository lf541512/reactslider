var React = require('react');
var classNames = require('classnames');
var $=require('jquery');
var moveAble = false;
var pageMoveInfo = {
    isMouseDown   : false,
    isDragging    : false, /*是否拖动了缩略图页面*/
    dY            : 0,
    isFirstStep   : true,
    moveIndex     : -1,
    lastMousePageY: 0
};

function movePageItem(moveObj, targetObj, moveObjOffsetTop) {

    if (moveObjOffsetTop < moveObj.parentNode.offsetTop - 10) {
        return false;
    }
    if (moveObjOffsetTop + moveObj.offsetHeight > moveObj.parentNode.scrollHeight) {
        return false;
    }
    moveObj.style.top = moveObjOffsetTop + "px";

    if (!targetObj) return true;
    if (targetObj.offsetTop + targetObj.offsetHeight < moveObj.offsetTop) {
        if (!targetObj.nextElementSibling) {
            debugger;
        }
        if (!targetObj.nextElementSibling.nextElementSibling) {
            return true;
        }
        targetObj.parentNode.insertBefore(targetObj.nextElementSibling, targetObj);
        //下移
    } else if (moveObj.offsetTop + moveObj.offsetHeight < targetObj.offsetTop) {
        //上移
        targetObj.parentNode.insertBefore(targetObj, targetObj.previousElementSibling);
    }
    return true;
}

function SlideScroll() {
    if (!pageMoveInfo.isDragging) {
        //var pageList=document.getElementById("page-list");
        //pageList.removeEventListener("scroll",SlideScroll);
        $('#page-list').off('scroll', SlideScroll);
        debugger;
        return;
    }
    var positionTop = pageMoveInfo.lastMousePageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
    movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop);
}
function pageMouseMove(e) {

    if (pageMoveInfo.isMouseDown) {
        if (pageMoveInfo.isFirstStep) {
            //var pageList=document.getElementById("page-list");
            //pageList.onScroll=this.SlideScroll;
            //pageList.addEventListener("scroll",SlideScroll);
            //$('#page-list').on('scroll', this.SlideScroll);
            $('#page-list').on('scroll', SlideScroll);

            //移动的第一次添加一个高度一样的空节点
            var itemObj = document.createElement("li");
            var itemHeight = pageMoveInfo.moveObj.offsetHeight;
            itemObj.setAttribute("style", "height:" + itemHeight + "px;");
            pageMoveInfo.targetObj = itemObj;
            $(itemObj).insertAfter(pageMoveInfo.moveObj);
            $(pageMoveInfo.moveObj).addClass('move');

            pageMoveInfo.moveObj.style.position = "absolute";
            pageMoveInfo.isFirstStep = false;
        }
        var positionTop = e.pageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
        if (movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop)) {
            pageMoveInfo.lastMousePageY = e.pageY;
        }
        pageMoveInfo.isDragging = true;
    }
}

function pageMouseUp(e) {

    pageMoveInfo.isMouseDown = false;
    document.removeEventListener('mouseup', pageMouseUp);
    document.removeEventListener('mousemove', pageMouseMove);
    //var pageList=document.getElementById("page-list");
    //pageList.onScroll=null;
    //pageList.removeEventListener("scroll",SlideScroll);
    $('#page-list').off('scroll', SlideScroll);
    console.log("dragging:" + pageMoveInfo.isDragging)
    if (pageMoveInfo.moveObj && pageMoveInfo.isDragging) {
        pageMoveInfo.moveObj.style.top = "0";
        pageMoveInfo.moveObj.style.position = "relative";
        var allSiblings = pageMoveInfo.moveObj.parentNode.children;
        var targetIndex = -1;
        for (var i = 0; i < allSiblings.length - 1; i++) {
            if (allSiblings[i] == pageMoveInfo.moveObj)continue;
            targetIndex++;
            if (allSiblings[i] == pageMoveInfo.targetObj) {
                pageMoveInfo.moveObj.parentNode.removeChild(pageMoveInfo.targetObj);
                break;
            }
        }
        allSiblings = pageMoveInfo.moveObj.parentNode.children;
        for (var i = 0; i < allSiblings.length; i++) {
            if (allSiblings[i] == pageMoveInfo.moveObj)break;
        }
        $(pageMoveInfo.moveObj).removeClass('move');
        if (targetIndex !== pageMoveInfo.moveIndex) {
            this.props.movePage(pageMoveInfo.moveIndex, targetIndex);
        }
    }
    setTimeout(function () {
        pageMoveInfo.isDragging = false;
    }, 50);
}
module.exports = React.createClass({
    render: function () {

        var classes = classNames({
            'page-item': true,
            'active'   : this.props.active
        });

        var i = this.props.index;
        return (
            <li className={classes} onClick={this.selectPage} onMouseDown={this.liMouseDown.bind(this,i)}>
                <div className="img">
                    {this.props.children}
                </div>
                <label className={"pages-slide-pageIndex"}>{i + 1}</label>


            </li>
        );

    },

    liMouseDown  : function (index, e) {
        if (pageMoveInfo.isMouseDown == true) {
            return;
        }
        pageMoveInfo.moveIndex = index;
        pageMoveInfo.isFirstStep = true;
        pageMoveInfo.isMouseDown = true;
        pageMoveInfo.parent = e.currentTarget.parentNode;
        pageMoveInfo.moveObj = e.currentTarget;
        pageMoveInfo.dY = e.pageY + pageMoveInfo.parent.scrollTop - e.currentTarget.offsetTop;

        document.addEventListener("mouseup", this.pageMouseUp);
        var _this=this
        setTimeout(function () {
            document.addEventListener("mousemove", _this.pageMouseMove);
        }, 20);

    },
    pageMouseMove: function (e) {
        if (pageMoveInfo.isMouseDown) {
            if (pageMoveInfo.isFirstStep) {
                //var pageList=document.getElementById("page-list");
                //pageList.onScroll=this.SlideScroll;
                //pageList.addEventListener("scroll",SlideScroll);
                $('#page-list').on('scroll', this.SlideScroll);
                //$('#page-list').on('scroll', SlideScroll);

                //移动的第一次添加一个高度一样的空节点
                var itemObj = document.createElement("li");
                var itemHeight = pageMoveInfo.moveObj.offsetHeight;
                itemObj.setAttribute("style", "height:" + itemHeight + "px;");
                itemObj.className = "target";
                pageMoveInfo.targetObj = itemObj;
                $(itemObj).insertAfter(pageMoveInfo.moveObj);
                $(pageMoveInfo.moveObj).addClass('move');

                pageMoveInfo.moveObj.style.position = "absolute";
                pageMoveInfo.isFirstStep = false;
            }
            var positionTop = e.pageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
            if (movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop)) {
                pageMoveInfo.lastMousePageY = e.pageY;
            }
            pageMoveInfo.isDragging = true;
        }
    },
    pageMouseUp  : function (e) {
        pageMoveInfo.isMouseDown = false;
        document.removeEventListener('mouseup', this.pageMouseUp);
        document.removeEventListener('mousemove', this.pageMouseMove);
        //var pageList=document.getElementById("page-list");
        //pageList.onScroll=null;
        //pageList.removeEventListener("scroll",SlideScroll);
        $('#page-list').off('scroll', this.SlideScroll);

        if (pageMoveInfo.moveObj && pageMoveInfo.isDragging) {
            pageMoveInfo.moveObj.style.top = "0";
            pageMoveInfo.moveObj.style.position = "relative";
            var allSiblings = pageMoveInfo.moveObj.parentNode.children;
            var targetIndex = -1;
            for (var i = 0; i < allSiblings.length - 1; i++) {
                if (allSiblings[i] == pageMoveInfo.moveObj)continue;
                targetIndex++;
                if (allSiblings[i] == pageMoveInfo.targetObj) {
                    pageMoveInfo.moveObj.parentNode.removeChild(pageMoveInfo.targetObj);
                    break;
                }
            }
            allSiblings = pageMoveInfo.moveObj.parentNode.children;
            for (var i = 0; i < allSiblings.length; i++) {
                if (allSiblings[i] == pageMoveInfo.moveObj)break;
            }
            $(pageMoveInfo.moveObj).removeClass('move');
            if (targetIndex !== pageMoveInfo.moveIndex) {
                this.props.movePage(pageMoveInfo.moveIndex, targetIndex);
            }
        }
        setTimeout(function () {
            pageMoveInfo.isDragging = false;
        }, 50);
    },
    SlideScroll  : function () {
        if (!pageMoveInfo.isDragging) {
            //var pageList=document.getElementById("page-list");
            //pageList.removeEventListener("scroll",SlideScroll);
            $('#page-list').off('scroll', this.SlideScroll);
            console.log("un remove scroll")
            debugger;
            return;
        }
        var positionTop = pageMoveInfo.lastMousePageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
        movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop);
    },
    selectPage   : function () {
        if (pageMoveInfo.isDragging)return;
        this.props.selectPage(this.props.index);
    }

});