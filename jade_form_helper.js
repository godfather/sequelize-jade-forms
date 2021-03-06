var jade = require('jade');

var JadeFormHelper = function() {
  this.form = [];
  this.formName = ""
  this.model    = {};
}

JadeFormHelper.prototype.start = function(model) {
  this.model    = model;
  this.formName = model.modelName();
}

JadeFormHelper.prototype.genericInput = function(name, type, options) {
  var id         = this.model.modelName() + '_' + name,
      field_name = this.model.modelName() + '[' + name + ']',
      value      = '';
      error      = '';
      
  if(this.model.errors) error = this.model.errors[name] ? this.model.errors[name] : '';
  if(this.model.errorData) value = this.model.errorData[this.model.modelName()][name] ? 'value="'+ this.model.errorData[this.model.modelName()][name] + '"' : '';
  
  var field  = '\n\t.row\n\t\tlabel(for="'+ id +'") ' + this.model.getAttributeLabel(name); 
      field += '\n\t\t\tinput(type="'+ type + '" name="'+ field_name +'" id="' + id + '" ' + value + ')';
      field += '\n\t\t.error '+ error + '\n';
  this.form.push(field);
}

JadeFormHelper.prototype.textField = function(name) {
  this.genericInput(name, 'text', {});
}

JadeFormHelper.prototype.fileField = function(name) {
  this.genericInput(name, 'file', {});
}

JadeFormHelper.prototype.textArea = function(name, options) {
  var id         = this.model.modelName() + '_' + name,
      field_name = this.model.modelName() + '[' + name + ']',
      error      = '';
      
  if(this.model.errors) error = this.model.errors[name] ? this.model.errors[name] : '';
  
  var field  = '\n\t.row\n\t\tlabel(for="'+ id +'") ' + this.model.getAttributeLabel(name); 
      field += '\n\t\t\ttextarea(name="'+ field_name +'" id="' + id + '")';
      field += '\n\t\t.error '+ error + '\n';
  this.form.push(field);
}

JadeFormHelper.prototype.selectField = function(name, values, options) {
  var id         = this.model.modelName() + '_' + name,
      field_name = this.model.modelName() + '[' + name + ']',
      error      = '';
      
  if(this.model.errors) error = this.model.errors[name] ? this.model.errors[name] : '';
  
  var field  = '\n\t.row\n\t\tlabel(for="'+ id +'") ' + this.model.getAttributeLabel(name); 
      field += '\n\t\t\tselect(name="'+ field_name +'" id="' + id + '")';
      
  if(values) for(k in values) { field += '\n\t\t\t\toption(value="' + k + '") ' + values[k]; }
  
      
      field += '\n\t\t.error '+ error + '\n';
  this.form.push(field);
}

JadeFormHelper.prototype.submitButton = function(name) {
  var field  = '\n\t.row.button';
      field += '\n\t\tinput(type="submit" name="'+ name +'")';

  this.form.push(field);
}


JadeFormHelper.prototype.end = function(method) {
  var form = 'form(method="' + method + '" name="' + this.formName + '")\n';
  for(i in this.form) { form += this.form[i]; }
  var out = jade.compile(form, {});
  return out();
}

JadeFormHelper.prototype.listData = function(models, key, value) {
  var data = {};
  if(models) for(i in models) { data[models[i][key]] = models[i][value]; }
  return data;
}

module.exports = function form() { 
  return function(req, res, next) {
    if(res.f) { return next(); }
    var f = new JadeFormHelper();
    res.locals.f = f;
    next();
  }
}