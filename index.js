/**
 * Created by 95 on 2015/10/26.
 */
var React=require('react');
var render=require('react-dom').render;
var PageList=require('./app/PageList.jsx');

//require('./css/css.css')
var app=document.getElementById("app");
render(<PageList /> ,app);
