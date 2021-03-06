YUI.add('inputex-list', function (Y, NAME) {

/**
 * @module inputex-list
 */
var lang = Y.Lang,
    inputEx = Y.inputEx;
   
/**
 * Meta field to create a list of other fields
 * @class inputEx.ListField
 * @extends inputEx.Field
 * @constructor
 * @param options Added options:
 * <ul>
 *   <li>sortable: Add arrows to sort the items if true (default false)</li>
 *   <li>elementType: an element type definition (default is {type: 'string'})</li>
 *   <li>useButtons: use buttons instead of links (default false)</li>
 *   <li>unique: require values to be unique (default false)</li>
 *   <li>listAddLabel: if useButtons is false, text to add an item</li>
 *   <li>listRemoveLabel: if useButtons is false, text to remove an item</li>
 *   <li>maxItems: maximum number of items (leave undefined if no maximum, default)</li>
 *   <li>minItems: minimum number of items to validate (leave undefined if no minimum, default)</li>
 * </ul>
 */
inputEx.ListField = function(options) {
      
   /**
    * List of all the subField instances
    * @property subFields
    */
   this.subFields = [];
      
   inputEx.ListField.superclass.constructor.call(this, options);
};
Y.extend(inputEx.ListField,inputEx.Field, {

   /**
    * Colors for the animation
    * @property arrowAnimColors
    */
   arrowAnimColors: {
      from: "#FFFF99",
      to: "#FFFFFF"
   },
      
   /**
    * Set the ListField classname
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.ListField.superclass.setOptions.call(this, options);

      this.messages = Y.mix(this.messages, Y.Intl.get("inputex-list"));
      
      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-ListField';
      
      this.options.sortable = lang.isUndefined(options.sortable) ? false : options.sortable;
      this.options.elementType = options.elementType || {type: 'string'};
      this.options.useButtons = lang.isUndefined(options.useButtons) ? false : options.useButtons;
      this.options.unique = lang.isUndefined(options.unique) ? false : options.unique;
      
      this.options.listAddLabel = options.listAddLabel || this.messages.listAddLink;
      this.options.listRemoveLabel = options.listRemoveLabel || this.messages.listRemoveLink;
      
      this.options.maxItems = options.maxItems;
      this.options.minItems = options.minItems;
   },
      
   /**
    * Render the addButton
    * @method renderComponent
    */
   renderComponent: function() {
         
      // Add element button
      if(this.options.useButtons) {
         this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
         this.fieldContainer.appendChild(this.addButton);
      }
         
      // List label
      this.fieldContainer.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
         
      // Div element to contain the children
      this.childContainer = inputEx.cn('div', {className: 'inputEx-ListField-childContainer'});
      this.fieldContainer.appendChild(this.childContainer);
      
      // Add link
      if(!this.options.useButtons) {
         this.addButton = inputEx.cn('a', {className: 'inputEx-ListField-addLink'}, null, this.options.listAddLabel);
         this.fieldContainer.appendChild(this.addButton);
      }
   },
      
   /**
    * Handle the click event on the add button
    * @method initEvents
    */
   initEvents: function() {
      Y.one(this.addButton).on('click', this.onAddButton, this, true);
   },
   
   /**
    * Validate each field
    * @method validate
    * @return {Boolean} true if all fields validate, required fields are not empty and unique constraint (if specified) is not violated
    */
   validate: function() {

      var response = true;
      
      var uniques = {}; // Hash for unique values option
      var l = this.subFields.length;

      // Validate maxItems / minItems
      if( lang.isNumber(this.options.minItems) && l < this.options.minItems  ) {
         response = false;
      }
      if( lang.isNumber(this.options.maxItems) && l > this.options.maxItems  ) {
         response = false;
      }

      // Validate all the sub fields
      for (var i = 0 ; i < l && response; i++) {
         var input = this.subFields[i];
         var state = input.getState();
         input.setClassFromState(state); // update field classes (mark invalid fields...)
         if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
            response = false; // but keep looping on fields to set classes
         }
         if(this.options.unique) {
            var hash = lang.dump(input.getValue());
            if(uniques[hash]) {
               response = false;    // not unique
            } else {
               uniques[hash] = true;
            }
          }
      }
      return response;
   },
      
   /**
    * Set the value of all the subfields
    * @method setValue
    * @param {Array} value The list of values to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      
      if(!lang.isArray(value) ) {
         throw new Error("inputEx.ListField.setValue expected an array, got "+(typeof value));
      }
         
      // Set the values (and add the lines if necessary)
      for(var i = 0 ; i < value.length ; i++) {
         if(i == this.subFields.length) {
            this.addElement(value[i]);
         }
         else {
            this.subFields[i].setValue(value[i], false);
         }
      }
      
      // Remove additional subFields
      var additionalElements = this.subFields.length-value.length;
      if(additionalElements > 0) {
         for(i = 0 ; i < additionalElements ; i++) {
            this.removeElement(value.length);
         }
      }
      
      inputEx.ListField.superclass.setValue.call(this, value, sendUpdatedEvt);
   },
      
   /**
    * Return the array of values
    * @method getValue
    * @return {Array} The array
    */
   getValue: function() {
      var values = [];
      for(var i = 0 ; i < this.subFields.length ; i++) {
         values[i] = this.subFields[i].getValue();
      }
      return values;
   },
      
   /**
    * Adds an element
    * @method addElement
    * @param {Any} The initial value of the subfield to create
    * @return {inputEx.Field} SubField added instance
    */
   addElement: function(value) {
   
      // Render the subField
      var subFieldEl = this.renderSubField(value);
   
      if(this.options.name) {
         subFieldEl.setFieldName(this.options.name+"["+this.subFields.length+"]");
      }
   
      // Adds it to the local list
      this.subFields.push(subFieldEl);
      
      return subFieldEl;
   },
   
   /**
    * Re-set the name of all the fields (when we remove an element)
    * @method resetAllNames
    */
   resetAllNames: function() {
      if(this.options.name) {
         for(var i = 0 ; i < this.subFields.length ; i++) {
            var subFieldEl = this.subFields[i];
            subFieldEl.setFieldName(this.options.name+"["+i+"]");
         }
      }
   },
   
   /**
    * Add a new element to the list and fire updated event
    * @method onAddButton
    * @param {Event} e The original click event
    */
   onAddButton: function(e) {
      e.halt();
      
      // Prevent adding a new field if already at maxItems
      if( lang.isNumber(this.options.maxItems) && this.subFields.length >= this.options.maxItems ) {
         return;
      }
      
      // Add a field with no value
      var subFieldEl = this.addElement();
      
      // Focus on this field
      subFieldEl.focus();
      
      // Fire updated !
      this.fireUpdatedEvt();
   },
      
   /**
    * Adds a new line to the List Field
    * @method renderSubField
     * @param {Any} The initial value of the subfield to create
    * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
    */
   renderSubField: function(value) {
         
      // Div that wraps the deleteButton + the subField
      var newDiv = inputEx.cn('div'), delButton;
         
      // Delete button
      if(this.options.useButtons) {
         delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
         Y.one(delButton).on('click', this.onDelete, this);
         newDiv.appendChild( delButton );
      }
         
      // Instantiate the new subField
      var opts = Y.merge({}, this.options.elementType);
      
      // New prefered way to set options of a field
      if (!lang.isUndefined(value)) {
         opts.value = value;
      }
      
      var el = inputEx(opts,this);
      
      var subFieldEl = el.getEl();
       Y.one(subFieldEl).addClass('inputEx-ListField-subFieldEl');
      newDiv.appendChild( subFieldEl );
      
      // Subscribe the onChange event to resend it
      el.on("updated",this.onChange, this, true);
   
      // Arrows to order:
      if(this.options.sortable) {
         var arrowUp = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowUp'});
         Y.one(arrowUp).on('click', this.onArrowUp, this);
         var arrowDown = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowDown'});
         Y.one(arrowDown).on('click', this.onArrowDown, this, true);
         newDiv.appendChild( arrowUp );
         newDiv.appendChild( arrowDown );
      }
      
      // Delete link
      if(!this.options.useButtons) {
         delButton = inputEx.cn('a', {className: 'inputEx-ListField-delLink'}, null, this.options.listRemoveLabel);
         Y.one(delButton).on('click', this.onDelete, this);
         newDiv.appendChild( delButton );
      }
   
      // Line breaker
      newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );
   
      this.childContainer.appendChild(newDiv);
         
      return el;
   },
      
   /**
    * Switch a subField with its previous one
    * Called when the user clicked on the up arrow of a sortable list
    * @method onArrowUp
    * @param {Event} e Original click event
    */
   onArrowUp: function(e) {
      var childElement = e.target._node.parentNode;
      
      var previousChildNode = null;
      var nodeIndex = -1;
      for(var i = 1 ; i < childElement.parentNode.childNodes.length ; i++) {
         var el=childElement.parentNode.childNodes[i];
         if(el == childElement) {
            previousChildNode = childElement.parentNode.childNodes[i-1];
            nodeIndex = i;
            break;
         }
      }
      
      if(previousChildNode) {
         // Remove the line
         var elToMove = this.childContainer.removeChild(childElement);
         
         // Adds it before the previousChildNode
         this.childContainer.insertBefore(elToMove, previousChildNode);
         
         // Swap this.subFields elements (i,i-1)
         var temp = this.subFields[nodeIndex];
         this.subFields[nodeIndex] = this.subFields[nodeIndex-1];
         this.subFields[nodeIndex-1] = temp;
   
         // Note: not very efficient, we could just swap the names
         this.resetAllNames();
   
         // Color Animation
         if(this.arrowAnim) {
            this.arrowAnim.stop(true);
         }
         
         this.arrowAnim = new Y.Anim({node:elToMove, from: {backgroundColor: this.arrowAnimColors.from}, to : {backgroundColor: this.arrowAnimColors.to },duration: 0.4});
         this.arrowAnim.on("end",function() { Y.one(elToMove).setStyle('backgroundColor', ''); });
         this.arrowAnim.run();
         
         // Fire updated !
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Switch a subField with its next one
    * Called when the user clicked on the down arrow of a sortable list
    * @method onArrowDown
    * @param {Event} e Original click event
    */
   onArrowDown: function(e) {
      var childElement = e.target._node.parentNode;
      
      var nodeIndex = -1;
      var nextChildNode = null;
      for(var i = 0 ; i < childElement.parentNode.childNodes.length ; i++) {
         var el=childElement.parentNode.childNodes[i];
         if(el == childElement) {
            nextChildNode = childElement.parentNode.childNodes[i+1];
            nodeIndex = i;
            break;
         }
      }
      
      if(nextChildNode) {
         // Remove the line
         var elToMove = this.childContainer.removeChild(childElement);
         
         // Adds it after the nextChildNode
         Y.one(nextChildNode).insert(elToMove, "after");
         
         // Swap this.subFields elements (i,i+1)
         var temp = this.subFields[nodeIndex];
         this.subFields[nodeIndex] = this.subFields[nodeIndex+1];
         this.subFields[nodeIndex+1] = temp;
   
         // Note: not very efficient, we could just swap the names
         this.resetAllNames();
   
         // Color Animation
         if(this.arrowAnim) {
            this.arrowAnim.stop(true);
         }
         this.arrowAnim = new Y.Anim({node: elToMove, from: {backgroundColor: this.arrowAnimColors.from}, to : {backgroundColor: this.arrowAnimColors.to }, duration: 1});
         this.arrowAnim.on("end",function() { Y.one(elToMove).setStyle( 'backgroundColor', ''); });
         this.arrowAnim.run();
         
         // Fire updated !
         this.fireUpdatedEvt();
      }
   },
      
   /**
    * Called when the user clicked on a delete button.
    * @method onDelete
    * @param {Event} e The original click event
    */
   onDelete: function(e) {
         
      e.halt();
      
      // Prevent removing a field if already at minItems
      if( lang.isNumber(this.options.minItems) && this.subFields.length <= this.options.minItems ) {
         return;
      }
         
      // Get the wrapping div element
      var elementDiv = e.target._node.parentNode;
      
      // Get the index of the subField
      var index = -1;
      
      var subFieldEl = elementDiv.childNodes[this.options.useButtons ? 1 : 0];
      for(var i = 0 ; i < this.subFields.length ; i++) {
         if(this.subFields[i].getEl() == subFieldEl) {
            index = i;
            break;
         }
      }
         
      // Remove it
      if(index != -1) {
         this.removeElement(index);
      }
      
      // Note: not very efficient
      this.resetAllNames();
   
      // Fire the updated event
      this.fireUpdatedEvt();
   },
      
   /**
    * Remove the line from the dom and the subField from the list.
    * @method removeElement
    * @param {integer} index The index of the element to remove
    */
   removeElement: function(index) {
      var elementDiv = this.subFields[index].getEl().parentNode;
         
      this.subFields[index] = undefined;
      this.subFields = inputEx.compactArray(this.subFields);
         
      // Remove the element
      elementDiv.parentNode.removeChild(elementDiv);
   },
   
   /**
    * Clear the field by setting the field value to this.options.value
    * @method clear
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   clear: function(sendUpdatedEvt) {
      this.setValue(lang.isUndefined(this.options.value) ? [] : this.options.value, sendUpdatedEvt);
   }
   
});

// Register this class as "list" type
inputEx.registerType("list", inputEx.ListField, [
   { type: 'string', label: 'List label', name: 'listLabel', value: ''},
   { type: 'type', label: 'List element type', required: true, name: 'elementType' }
]);


}, '@VERSION@', {
    "requires": [
        "inputex-field",
        "anim-base",
        "anim-color"
    ],
    "skinnable": true,
    "ix_provides": "list",
    "lang": [
        "en",
        "fr",
        "de",
        "ca",
        "es",
        "fr",
        "it",
        "nl",
        "pl",
        "pt-BR"
    ]
});
