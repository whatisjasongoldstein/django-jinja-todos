React can use the same component templates that render on both serverside and in Javascript.

Can I make Django do the same using Nunjucks+Jinja2?

Let's start small, TODOMVC style.

## Progress

- [x] Serializing baked into models
- [x] Components render in both Python and Javascript
- [x] JS for editing and updating the ToDo List 
- [x] Adds, updated, and deletes persist to the server
- [x] JS for filtering the ToDo list
- [ ] Deserializing/saving baked into the model
- [ ] Reasonable approach to API's
- [ ] Make code not garbage
- [ ] Minimize boilerplate
- [ ] A second app scope?

## Notes

- The logic to set context has to live in both Python and Javascript. So far almost everything else is DRY.
- Like react, components must have a single root element, and describe all their own classes/attributes. Focus and scroll position are safe thanks to morphdom.
- Never use jquery.data or anything else that caches information to the DOM. The render function owns the DOM and will trash it at will.
- A js "app" should be a single dynamic component. The app is not the whole site, that just results in infinitely complete javascript with no apparent benefits. Those components could share datastores if you're building something like Facebook where disparate pieces of UI read the same information. I can imagine some kind of pubsub would be useful.
- Any input values or form-related states that affect the DOM need to be part of the rendering context, otherwise they'll be wiped up on render. In some cases, this doesn't matter because it's fine if an unrelated action aborts the current edit. I'm thinking there could be a dictionary mapping input's values by their names.
