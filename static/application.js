$(function() {
    
  var Message = Backbone.Model.extend({});

  var MessageStore = Backbone.Collection.extend({
      model: Message,
      url: 'messages',
      sync: _.sync,
      idAttribute: '_id'
  });

  var messages = new MessageStore();

  var MessageView = Backbone.view.extend({
      
      events: { "submit #chatForm" : "handleNewMessage" },
      
      handleNewMessage: function(data) {
          var inputField = $('input[name=newMessageString]');
          messages.create({content: inputField.val()});
          inputField.val('');
      },
      
      render: function() {
          var data = messages.map(function(message) { return message.get('content') + '\n'});
          var result = data.reduce(function(memo,str) {return memo + str }, '');
          $('#chatHistory').text(result);
          return this;
      }
  });
  
  DNode()
  .use(dnodeBackbone({
      pubsub: true
  }))
  .connect(_.once(function() {
      window.App = new AppView();
  }));

});


  