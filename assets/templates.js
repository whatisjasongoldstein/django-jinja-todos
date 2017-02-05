(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/todo.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<!-- These are here just to show the structure of the list items -->\n<!-- List items should get the class `editing` when editing and `completed` when marked as completed -->\n<li class=\"todo-item ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"complete")) {
output += "completed";
;
}
output += "\" data-id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"id"), env.opts.autoescape);
output += "\">\n    <div class=\"view\">\n        <input class=\"toggle js-complete\" type=\"checkbox\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"complete")) {
output += "checked";
;
}
output += ">\n        <label>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"name"), env.opts.autoescape);
output += "</label>\n        <button class=\"destroy\"></button>\n    </div>\n    <input class=\"edit js-item\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "item")),"name"), env.opts.autoescape);
output += "\">\n</li>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/todolist.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<section class=\"todoapp\">\n    <header class=\"header\">\n        <h1>todos</h1>\n        <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n    </header>\n    <!-- This section should be hidden by default and shown when there are todos -->\n    <section class=\"main\">\n        <input class=\"toggle-all\" type=\"checkbox\">\n        <label for=\"toggle-all\">Mark all as complete</label>\n        <ul class=\"todo-list\">\n            ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "items");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("item", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n                ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("components/todo.njk", false, "components/todolist.njk", null, function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
callback(null,t_5);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_8,t_6) {
if(t_8) { cb(t_8); return; }
callback(null,t_6);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n            ";
});
}
}
frame = frame.pop();
output += "\n        </ul>\n    </section>\n    <!-- This footer should hidden by default and shown when there are todos -->\n    <footer class=\"footer\">\n        <!-- This should be `0 items left` by default -->\n        <span class=\"todo-count\"><strong>0</strong> item left</span>\n        <!-- Remove this if you don't implement routing -->\n        <ul class=\"filters\">\n            <li>\n                <a class=\"selected\" href=\"#/\">All</a>\n            </li>\n            <li>\n                <a href=\"#/active\">Active</a>\n            </li>\n            <li>\n                <a href=\"#/completed\">Completed</a>\n            </li>\n        </ul>\n        <!-- Hidden if no completed items are left ↓ -->\n        <button class=\"clear-completed\">Clear completed</button>\n    </footer>\n</section>\n<footer class=\"info\">\n    <p>Double-click to edit a todo</p>\n    <!-- Remove the below line ↓ -->\n    <p>Template by <a href=\"http://sindresorhus.com\">Sindre Sorhus</a></p>\n    <!-- Change this out with your name and url ↓ -->\n    <p>Created by <a href=\"http://todomvc.com\">you</a></p>\n    <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
