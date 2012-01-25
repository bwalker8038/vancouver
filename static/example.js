$(function() {
  window.Message = Backbone.Model.extend({
    url  : 'messages',
    type : 'message',
    sync : _.sync,
    idAttribute : '_id'

    defaults: {
      content : "empty message"}
  })
});
