$(function() {
    
  window.Message = Backbone.model.extend({
  
      url : 'messages',
      type : 'message',
      sync: _.sync,
      idAttribute: '_id',

      defaults: {
        content: ''
      },

      initialize: function() {
          if (!this.get('content')) {
            this.set({"content": this.defaults.content});
          }
      },

  });
  
  window.MessageList = Backbone.Collection.Extend({
    model: Message,

    url : 'messages',
    type: 'message',
    sync = _.sync,
    idAttribute: '_id',

    nextOrder: function() {
      if(!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: function(message) {
      return message.get('order');
    }

  });


  window.Messages = new MessageList;

  window.messageView = Backbone.View.extend({
    tagName: "li",

    template: _.template($('#item-template').html()),

    events: { "keypress .message-input" : "updateOnEnter" },

    intitialize: function() {
      _.bindAll(this, 'render', 'close');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    setContent: function() {
      var content = this.model.get('content');
      this.$('.message-content').text(content);
      this.input.bind('blur', this.close);
      this.input.val(content);
    },

    close: function() {
      this.model.save({content: this.input.val()});
    },

    updateOnEnter: function(e) {
        if(e.keyCode == 13) this.close();
    }

  });

  window.AppView = Backbone.View.extend({
    el: $("#messageApp"),

    events: {
      "keypress #new-message": "createOnEnter",
      "keyup #new-message": "showTooltip"
    },

    initalize: function() {
      _.bindAll(this, "addeOne", "addAll", "render");

      this.input = this.$("new-message");

      Message.bind('add',   this.addOne);
      Message.bind('reset', this.addAll);
      Message.bind('all',   this.render);

      Message.bind('subscribe', function(data){
        console.log('subscribed', data);
      });
      Message.bind('unsubscribed', function(data){
        console.log('unsubscribed', data);
      });

      Messages.subscribe();
      Messages.fetch();
    },
    
    addOne: function(message) {
      var view = new MessageView({model: message});
      this.$("#message-list").append(view.render().el);
    },

    addAll: function() {
      Messages.each(this.addOne);
    },

    newAttributes: function() { 
      return {
        content: this.input.val(),
        order:   Messages.nextOrder()
      };
    },

    createOnEnter: function(e) {
      if(e.keycode != 13) return;
      Messages.create(this.newAttributes());
      this.input.val('');
    },

    showTooltip: function(e) {
      var tooltip = this.$('.ui-tooltip-top');
      var val = this.input.val();
      tooltip.fadeOut();
      if(this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if(val == '' || val == this.input.attr('placeholder')) return;
      var show = function() { tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }
    
  });

  Dnode()
    .use(dnodeBackbone({
      pubsub: true
    }))
    .connect(_.once(function() {
      window.App = new AppView
    }));

});


  
