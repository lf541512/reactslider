var React = require('react');
var PageItem=require('./PageItem.jsx');
module.exports = React.createClass({
    getInitialState(){
        return {
            pages   : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            selected: 0
        }
    },
    movePage(moveIndex,targetIndex){
        if (moveIndex == targetIndex) return;
        var pages=this.state.pages.slice(0);
        pages.splice(targetIndex, 0, pages.splice(moveIndex, 1)[0]);
        this.setState({pages:pages});
        var selected=this.state.selected;
        if ((moveIndex > selected) && (targetIndex <= selected)) {
            //选中页后面到前面
            this.selectPage(selected + 1)

        } else if ((moveIndex < selected) && (targetIndex >= selected)) {
            this.selectPage(selected - 1)
        } else if (moveIndex ==selected) {
            this.selectPage(targetIndex);
        }
    },
    selectPage(index){
        this.setState({selected:index});
    },
    render(){
        var items = this.state.pages.map((content, index)=> {
            return <PageItem key={index} index={index} active={this.state.selected === index} movePage={this.movePage} selectPage={this.selectPage}>{content}</PageItem>
        })
        return (
            <ul id="page-list" style={{height: 900}}>
                {items}
                <li className="pages-container-whitespace"></li>
            </ul>
        )
    }
});