(function(window, document, $){

    function lazyRender(el, html) {
        let cloneEl = el.cloneNode();
        cloneEl.innerHTML = html;
        window.requestAnimationFrame(function(){
            morphdom(el, cloneEl);
        });
    };

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    /**
     * Datastore.
     */
    window.app = {
        init: function() {
            this.data = JSON.parse(document.getElementById("data").innerText);
            this.$app = $(".a-todo-app");
            this.bindEvents();
        },
        bindEvents: function() {

            var self = this;

            /**
             * Select todo
             */
            this.$app.on("click", ".view label", function(){
                var $item = $(this).closest(".todo-item")
                $item.addClass("editing");
                var $input = $item.find(".edit");

                // Moves cursor to the end of the line.
                $input.val($input.val()).focus();
            });

            this.$app.on("blur", ".edit", function() {
                var todo = self.getTodoFromElement(this);
                if (this.value !== todo.name) {
                    todo.name = this.value;
                    self.saveTodo();
                    self.render();
                } else {
                    $(this).closest("li").removeClass("editing");
                }
            });

            this.$app.on("change", ".js-complete", function(){
                var todo = self.getTodoFromElement(this);
                todo.complete = this.checked;
                self.saveTodo(todo);
                self.render();
            });

            this.$app.on("keyup", ".new-todo", function(e){
                if (e.key === "Enter") {
                    self.addTodo(this.value);
                };
                if (e.key === "Escape") {
                    this.value = "";
                }
                self.data.input = this.value;
            });

            this.$app.on("click", ".destroy", function(e){
                var todo = self.getTodoFromElement(this);
                self.removeTodo(todo);
            });
        },

        /**
         * Given any element, climb the tree
         * until you find the todo's id, and look
         * it up in the data.
         */
        getTodoFromElement: function(el) {
            var id = $(el).closest("[data-id]").data().id;
            var results = $.grep(this.data.todos, function(item) {
                return item.id === id;
            });
            return results[0];
        },

        addTodo: function(name) {
            var todo = {
                id: new Date().getTime(),
                name: name,
                complete: false,
            }
            this.data.todos.push(todo);
            this.saveTodo(todo);
            this.render()
        },

        removeTodo: function(todo) {
            this.data.todos = $.grep(this.data.todos, function(item) {
                return item.id !== todo.id;
            });
            this.render()
            console.log("delete from an api");
        },

        saveTodo: function(todo) {
            console.log("Saved to an api!");
        },

        render: function() {
            var html = nunjucks.render("components/todolist.njk", {
                items: this.data.todos,
                input: this.data.input || "",
            });
            lazyRender(this.$app[0], html);
        },
    }

    app.init();

})(window, document, jQuery);