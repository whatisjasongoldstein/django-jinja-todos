/**
 * csrf token setup for ajax request.
 * @see https://docs.djangoproject.com/en/1.10/ref/csrf/#ajax
 */
(function(window, $){
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');    

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

})(window, jQuery);


(function(window, document, $){

    function lazyRender(el, html) {
        let cloneEl = el.cloneNode();
        cloneEl.innerHTML = html;
        window.requestAnimationFrame(function(){
            morphdom(el, cloneEl);
        });
    };

    function uuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Datastore.
     */
    window.app = {
        init: function() {
            this.data = JSON.parse(document.getElementById("data").innerText);
            this.$app = $(".a-todo-app");
            this.bindEvents();

            // Since hashes aren't sent to the server, 
            // this is only done in js. It will trigger a render.
            this.setFilter();
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
                if (e.key === "Enter" && this.value !== "") {
                    var newTodoName = this.value;
                    self.data.input = "";
                    this.value = "";
                    self.addTodo(newTodoName);
                };
                if (e.key === "Escape") {
                    this.value = "";
                }
                self.data.input = this.value;
            });

            this.$app.on("click", ".destroy", function(e){
                var todo = self.getTodoFromElement(this);
                if (todo) {
                    self.removeTodos([todo]);
                }
                e.preventDefault();
            });

            this.$app.on("click", ".clear-completed", function(e){
                var todos = self.filters.completed(self.data.todos);
                if (todos.length) {
                    self.removeTodos(todos);
                }
                e.preventDefault();
            });

            $(window).on("hashchange", self.setFilter.bind(self));
        },

        /**
         * Functions that filter todos before
         * being rendered.
         */
        filters: {
            all: function(todos) {
                return todos;
            },
            completed: function(todos) {
                return todos.filter(function(item){
                    return item.complete;
                });
            },
            active: function(todos) {
                return todos.filter(function(item){
                    return !item.complete;
                });
            },
        },

        /**
         * Set active filter to a function based on the hash,
         * falling back to all.
         *
         * This determines the subset of items that render.
         */
        setFilter: function() {
            var key = window.location.hash.split("/")[1];
            this.activeFilter = this.filters[key] || this.filters.all;
            this.render();
        },
        
        getTodoById: function(uuid) {
            var results = this.data.todos.filter(function(item) {
                return item.uuid === uuid;
            });
            if (!results.length) {
                console.error(`Can't find todo for ${uuid}`);                
            }
            return results[0];
        },

        /**
         * Given any element, climb the tree
         * until you find the todo's id, and look
         * it up in the data.
         */
        getTodoFromElement: function(el) {
            var uuid = $(el).closest("[data-uuid]").attr("data-uuid");
            return this.getTodoById(uuid);
        },

        addTodo: function(name) {
            var todo = {
                uuid: uuid(),
                name: name,
                complete: false,
            }
            this.data.todos.push(todo);
            this.saveTodo(todo);
            this.render()
        },

        removeTodos: function(todos) {
            var uuids = todos.map(function(todo){
                return todo.uuid
            });
            this.data.todos = this.data.todos.filter(function(item) {
                return (uuids.indexOf(item.uuid) === -1);
            });
            this.render();
            $.post("/endpoint/", {
                delete: JSON.stringify(uuids)
            });
        },

        saveTodo: function(todo) {
            $.post("/endpoint/", {
                todo: JSON.stringify(todo)
            });
        },

        render: function() {
            var html = nunjucks.render("components/todolist.njk", {
                items: this.activeFilter(this.data.todos),
                filter: this.activeFilter.name,
                input: this.data.input || "",
                count: this.filters.active(this.data.todos).length,
            });
            lazyRender(this.$app[0], html);
        },
    }

    app.init();

})(window, document, jQuery);