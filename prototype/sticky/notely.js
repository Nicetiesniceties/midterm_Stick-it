if (!console){
	var console = {log: function(){}}
}
if (!JSON){
	var JSON = {stringify: function(){}}
}

// GLOBAL VARIABLES

var canvas;
var selectedNoteId;
var notes;
var noteCancelBtn;
var noteCounter = 0;
var noteList;
var signupForm;
var loginForm;
var loginSuccessForm;
var xmlhttp;
var overlay;
var user;
var ajaxState;
var notification;
var notificationTitle;
var notificationText;
var noteNicEditor;
var nicPanel;
var nextZIndex = 0;
var noteDefaultWidth = 215;
var noteDefaultOuterWidth = noteDefaultWidth + 20;
var noteDefaultHeight = 80;
var todoNoteDefaultHeight = 30;
var noteDefaultOuterHeight = noteDefaultHeight + 20;
var navbarDefaultHeight = 43;
var loggedIn;
var isFBLogin;
var vanity;
var notelyURL = "http://note.ly/";

// ===================
// INITIALIZE PAGE OBJECT AND CANVAS
// ===================

var Page = {
	subnavbarHeight: '40px',
	activeColor: $('.note-color').attr('name'),
	activeNote: null,
	activeLightbox: false,
	activeLoginLoad: false,
	activeWallLoad: false,
	wallLoaded: false,
	lightbox: function(html){
		// Potential upgrade: change to lightbox name/id?
		$('#simplemodal-container').removeClass('loading').hide().html(html);
		Page.resizeLightbox();
		$('#simplemodal-container').slideDown('slow');
	},
	loading: function(wallLoad){
		if (wallLoad == null){
			this.activeWallLoad = false;
		}
		else {
			this.activeWallLoad = !!wallLoad;
			wallLoaded = true;
		}
		
		this.activeLightbox = false;
		$('#lightbox').modal({
			opacity: 60, 
			onOpen: function (dialog) {
				$('.simplemodal-overlay').click(function(event){
					location.hash = '';
				});	
				dialog.container.addClass('loading');
				dialog.overlay.fadeIn('slow', function(){
					dialog.data.show();
					dialog.container.fadeIn('fast');
					Page.activeLightbox = true;	
				});
			},
			onClose: function(dialog){
				dialog.data.stop(true,false).fadeOut('slow', function () {
					dialog.container.stop(true,false).slideUp('fast', function () {
						dialog.overlay.stop(true,false).fadeOut('fast', function () {
							Page.activeLightbox = false;
							$.modal.close(); // must call this!
							Page.loginLoad();
						});
					});
				});
			}
		});
	},
	loginLoad: function(){
		if (this.activeLoginLoad){
			this.activeLoginLoad = false;
			Page.clearAll();

			console.log("loginLoad");
			Ajax.loadWall();
			
			// DOESNT SEEM TO FIRE ON LOGIN
						
		}
		
	},
	hideLightbox: function(){
		if ($('#simplemodal-container').length > 0){
			$.modal.close();
		}
	},
	hideLoading: function(){
		if ($('#simplemodal-container').hasClass('loading')){
			$.modal.close();
		}
		else {
			$('#simplemodal-container').removeClass('loading');
		}
	},
	hideWallLoading: function(){
		if (this.activeWallLoad){
			$.modal.close();
			this.activeWallLoad = false;
		}
	},
	resizeLightbox: function(){
		$("#simplemodal-container").css({
			height: 'auto',
			width: 'auto'
		});
		$(window).trigger('resize.simplemodal');
		$.modal.setPosition();
	},
	twentySeven: function(event){
		if (event.keyCode == 27) {
			if (canvas.activeNote == null){
				location.hash = '';
				Page.exitSetColorMode();
			}
			if (canvas.pendingColor != null){
				this.exitSetColorMode();
			}
		}
	},
	showFormSubmitting: function(){
		$('input', 'select').prop('disabled', true);
		$('.controls').hide();
		$('.submitting').show();		
	},
	hideFormSubmitting: function(){
		$('input, select').prop('disabled', false);
		$('.controls').show();
		$('.submitting').hide();		
	},
	loginSuccess: function(email){
	
		// FIRES ON SUCCESSFUL LOGIN IN PAGE
		
		console.log("loginSuccess");
		
		Ajax.loadWall();
		$('.user-email-display').html(email);
		$('.not-logged-in').fadeOut('fast', function(){
			$('.is-logged-in').fadeIn('fast');
		});

		
	},
	setBackground: function(bgFilename){
		$('#canvas').removeClass('cork metal bamboo wood').addClass(bgFilename).attr('name', bgFilename);
	},
	enterSetColorMode: function(color){
		Ajax.updateColor(color);
		$('#set-color-message').show().find('i.note').removeClass().addClass('note note-'+color);
		$('div.note').addClass('setting-color');
		$(document).bind('mousemove', function(e){
			$('#set-color-message').css({
			   left:  e.pageX + 15,
			   top:   e.pageY + 20
			})
		});
	},
	exitSetColorMode: function(){
		canvas.pendingColor = null;
		$('div.note').removeClass('setting-color');
		$('#set-color-message').hide();
		$(document).unbind('mousemove');
	},
	keyCombos: function(event){
		if ((event.keyCode == 83 && event.ctrlKey) || (event.keyCode == 83 && event.altKey)){
			event.preventDefault();
			saveActiveNote();
			return false;
		}
		if (event.keyCode == 78 && event.altKey){
			event.preventDefault();
			canvas.newNote($('.note-color').attr('name'));
			return false;
		}
		if (event.keyCode == 9 && $('#simplemodal-container').length > 0){
			$('input:focus').closest('.field-wrapper').nextAll().find('input, button').eq(0).focus();
		}
		if (/*event.keyCode == 9 ||*/ event.keyCode == 27 || (event.keyCode == 13 && event.ctrlKey)){
			saveActiveNote();
			canvas.blurAny();
			return false;
		}
	},
	setDefaultColor: function(color){
		if (color != null){
			this.activeColor = color;
			$('.note-color i.note-color-choice').removeClass().addClass('note-color-choice note-color-choice-' + color);
		}
	},
	clearAll: function(){
		// Does not delete, only clears from screen.
		for (i in notes){
			$(notes[i].contentBox).remove();
		}
	},
	showIntroTooltips: function(){	
	console.log("tooltips firing");
	  $('#ui-tooltip-intro-left').fadeIn(800, function() {
	  });	
	
	  $('#ui-tooltip-intro-right').fadeIn(800, function() {
	  });
	},	
	afterRegistration: function(email, vanity){
		// CALLED ON SIGNUP ON PAGE AFTER SUCCESS RESPONSE RECEIVED IN AJAX
		Ajax.saveAll();
		$('.user-email-display').html('Welcome, '+email);
		$('.not-logged-in').fadeOut('fast', function(){
			$('.is-logged-in').fadeIn('fast');
		});
		
		Page.showShareBar(true, vanity);
		
	},
	showShareBar: function(FBParse, pVanity){
	
		console.log("page.showShareBar()");
		
		$('#sharebarURL').text(notelyURL + pVanity);
	
		$( "#FBShareButtonContainer" ).html('<div id="FBShareButton" class="fb-share-button" data-href="http://note.ly/' +  pVanity + '" data-layout="button"></div>');
		
		if (FBParse) {
			// finally - FB doco is wrong, need to parse parent entity
			FB.XFBML.parse(document.getElementById('FBShareButtonContainer'));
		}
		
		// change sharebar left to compensate for changed width
		console.log("share bar width");
		console.log($('#sharebar2').width());
		
		$('#sharebar2').css('left', -1 * $('#sharebar2').width() / 2);
		
		$('#sharebar2').css('display', 'inline');		
		
	}	
}

var $sub = $('.subnavbar');
var $colorOverlay = $('#note-color-overlay');
var spinner = preload('img/loading.gif');

function preload(file){
	if (document.images){
		var img = new Image();
		img.src = file;
		return img;
	}
}

	

$(function(){

	init();	// Original OSN
	
	console.log("User logged in via Session or Cookie?:" + loggedIn);
	console.log("Is this an FB login?:" + isFBLogin);
	
	// if this is an FB login, need to validate still FB logged in
	if (isFBLogin) {
		
		FB.login(function(response) {
	  	
	  	if (response.status != 'connected') {

		  	window.location.replace("submit.php?request=logout");
	  
	  	}
	  	
	  }, {scope: 'public_profile,email'});
	}
	
	// FIRES FROM COOKIE LOGIN
	

	if (loggedIn) {
		
		Page.showShareBar(false, vanity); 
	
	}
	
	console.log("$(function()");
			
	Ajax.loadWall();

	hashChange(true);
	$(window).bind('hashchange', function(){
		hashChange();
	});
	$(window).keydown(function(e){
		Page.twentySeven(e);
		Page.keyCombos(e);
	});
	
	Page.setBackground('cork');
	$('.select-option-category, .note-select-color').hide();
	$('#cb-pulltag').fadeIn('fast');
	
	$('#deleteNote').mousedown(function(){
		//if (confirm('Delete this note?')){
			canvas.removeActive();
		//}
	});

	
	$('.options').click(function(){
		canvas.blurAny();
		$(this).toggleClass('show');
		if ($colorOverlay.hasClass('show')){
			$colorOverlay.removeClass('show').fadeOut('fast');
		}
		$sub.toggleClass('show');
		if ($sub.hasClass('show')){
			$('.select-option-category').show();
			$sub.stop(true, false).animate({height: Page.subnavbarHeight}, 500);
		}
		else {
			if ($('.select-option-category').css('display') == 'none'){
				$sub.stop(true, false).animate({height: '0px'}, 300, function(){
					$('.subnavbar .navbar-side').hide();
					$sub.toggleClass('show');
					$('.select-option-category').show();
					$sub.stop(true, false).animate({height: Page.subnavbarHeight}, 300);
				});
			}
			else {
				$sub.stop(true, false).animate({height: '0px'}, 300, function(){
					$('.subnavbar .navbar-side').hide();
				});	
			}
		}		
	});
	
	$('.select-option-category a').click(function(){
		$sub.removeClass('show').stop(true, false).animate({height: '0px'}, 500, function(){
			$('.subnavbar .navbar-side').hide();
		});	
	});
	
	$('.note-add').click(function(){
		Page.exitSetColorMode();
		canvas.newNote(Page.activeColor, null, 0, null);
	});

	$('.note-list').click(function(){
		Page.exitSetColorMode();
		canvas.newNote(Page.activeColor, null, 2, null);
		 
		//alert(notes.length);

$(".listItem1").keypress(function(e) { 
		
		console.log("LISTITEM KEYPRESS2");
		
						var txtid=(this.id);
						var myArray = txtid.split('_');
						var commonPostfix=myArray[1];
						
						
						if ( e.which == 13 ) {
								
						e.preventDefault();
						var thecode = e.keyCode || e.which; 
						var txt=$("#"+txtid).val();
						//var id= num;
						
						//var l=$("#ul_"+commonPostfix).getElementsByTagName('li').length;
						 var l=$('ul#ul_'+commonPostfix+' li').length; 
 						
						 
						 if(l>0){
						 var lastLiId=($('ul#ul_'+commonPostfix+' li:last').attr('id')  );
						 // alert(lastLiId);
						  var lisplt= lastLiId.split('_');
						   var newl= parseInt(lisplt[2]);
						  // alert(newl);
						 var id=newl+1;
						 }else{
							 
							 var id=l+1; 
						 }
						 
						// $('ul#someList li:first')
						 //alert($('#ul_'+commonPostfix).last().css('background-color', 'red'));
						 	/*	$("#ul_"+commonPostfix).append("<li id='li_"+id+"' > <input type='checkbox' name='complete' id='complete'  value='1' /> "+txt+"<span style='cursor:pointer;' title='delete' id='spn_"+id+"'  onclick='deleteLine(\""+id+"\");'>&nbsp;&nbsp;&nbsp;X<span></li>");
						 */
						  var notedbid=canvas.activeNote.dbId;  
						   if(txt!=''){  
$("#ul_"+commonPostfix).append("<li class='todoli' id='li_"+notedbid+"_"+id+"' > <input class='listNoteCheckbox' type='checkbox' name='complete' id='complete_"+id+"' value='1' onclick='markLine(\""+notedbid+"\",\""+id+"\");' /><div class='todoContent'>"+txt+"</div><div class='todoListDelete' style='cursor:pointer;' title='delete' id='delete_"+notedbid+"_"+id+"'  onclick='deleteLine(\""+notedbid+"\",\""+id+"\");'>&nbsp;&nbsp;&nbsp;x<div></li>");
 						
					 
						// insert lines into db  
						 $.post("submit.php",{ action: "addline", notelistid:commonPostfix,content:txt,notedbid:notedbid,lineid:'li_'+notedbid+'_'+id } , function(data) {
						// alert( data);
						
						});
 	
						   }
						
						$("#"+txtid).val('');
						$("#"+txtid).focus();	
						//num++;
			
						}
						
				});	
		


		
	});


	


	$('.note-image').click(function(){
		Page.exitSetColorMode();
		//alert("here");
		
	$('#osnfileinput').click();		
		
		//canvas.newNote(Page.activeColor, null, true);
	});
	
	
	
	$('.note-color').click(function(){
		$(this).toggleClass('show');
		if ($sub.hasClass('show')){
			$sub.removeClass('show').stop(true, false).animate({height: '0px'}, 300, function(){
				$('.subnavbar .navbar-side').hide();
			});	
		}
		$colorOverlay.toggleClass('show');
		if ($colorOverlay.hasClass('show')){
			$colorOverlay.fadeIn('fast');
		}
		else {
			$colorOverlay.fadeOut('fast');
		}
	});
	
	$('#note-color-overlay i.note-color-choice').click(function(){
		var newColor = $(this).attr('name');
		$('.note-color i.note-color-choice').removeClass().addClass('note-color-choice note-color-choice-' + newColor);
		Page.activeColor = newColor;
		canvas.setActiveNoteColor(newColor);
		$('.note-color').click();
	});
	
	$('.close-subnavbar').click(function(){
		$sub.removeClass('show').stop(true, false).animate({height: '0px'}, 500, function(){
			$('.subnavbar .navbar-side').hide();
		});
	});
	
	//-- CB Pulltag --//
	$('#cb-pulltag').css({
		position: 'absolute',
		width: '220px',
		height: '40px',
		bottom: '5px',
		right: '-180px',
		display: 'block',
		textDecoration: 'none',
		border: 'none',
		outline: 'none'
	}).find('img').css({
		width: '220px',
		height: '40px'
	});
	$('#cb-pulltag').hover(function(){
		$(this).stop(true,false).delay(150).animate({right: '5px'}, 500);
	}, function(){
		$(this).stop(true,false).animate({right: '-180px'}, 500);
	}); 

	fileUploadInit();


});


function fileUploadInit() {
	
	$('#fileupload').bind('fileuploadadded', function (e, data) {     	
    	console.log("FILE UPLOAD FILE ADDED");
    	if(!data.isValidated) {
			alert("Invalid file format. Please choose an image file (JPG, GIF, PNG) under 500KB in size.");    		
    	}
	});	
	
	$('#fileupload').bind('fileuploaddone', function (e, data) {  
			console.log(data); 
    		console.log("FILE UPLOAD DONE");
			canvas.newNote(Page.activeColor, null, 1, data.result[0].name);    	       
	});    	
    	
}
 



 
 

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------



    

function init() {

 	//initCanvasLoader();

	noteCounter = 0;
	canvas = new objCanvas();
	notes = [];
    overlay = document.getElementById('overlay');
    user = new objUser();

	noteCancelBtn = new objNoteCancelBtn();
    signupForm = new objSignupForm();
    loginForm = new objLoginForm();
	loginSuccessForm = document.getElementById("loginSuccessForm");
		
	notification = document.getElementById('notification');
	notificationTitle = document.getElementById('notificationTitle');
	notificationText = document.getElementById('notificationText');
	nicPanel = document.getElementById('nicPanel');

	var file = document.createElement('script');
	file.setAttribute("type","text/javascript");

	document.body.appendChild(file);	
	
	noteNicEditor = new nicEditor();
	noteNicEditor.setPanel('nicPanel');
	
	$('#nicPanel').mousedown(function(event){
		stopBubble(event);
		 canvasClickAction(event); // this code line is added by sipl
		return;
	});
	
	if ($.browser.msie){
		$('#canvas').mousedown(function(e){
			canvasClickAction(e);
		});	
	}
	else {
		$('#canvas').click(function(e){
			canvasClickAction(e);
			 
		});			
	}
	
	$('div.note, #nicPanel').click(function(e){

		stopBubble(e);
	});
 



	// SETUP TOOLTIPS
    $( '.button' ).tooltip();
    $( '.show-about' ).tooltip();
	
	// HIDE TOOLTIPS  
 	$('.note-add,.note-list,.note-image,.note-color,.show-about,.options').mouseover(function() { 
		hideIntroTooltips(); 
	});
 

 
 	
 	console.log("INIT BOTTOM");

 } 

// =======================================
// CANVAS CLICK, DESELECT ALL NOTES

function canvasClickAction(e){
	// alert(canvas.activeNote.id);
	console.log("CANVAS CLICK ACTION");
	
	stopBubble(e);
	if (canvas.activeNote == null) {
		//var newNote = canvas.newNote(Page.activeColor, {x: e.pageX, y: e.pageY - navbarDefaultHeight});
		Page.exitSetColorMode();
	}
	else {
		if ((canvas.activeNote.id != e.target.id) && (canvas.activeNote.id != e.target.parentNode.id)) {
			
			// IF TO DO LIST NOTE, HIDE ENTRY FORM AGAIN
			//console.log("canvas.activeNote.image: " + canvas.activeNote.image);
			if (parseInt(canvas.activeNote.image) == 2) { 
				$(canvas.activeNote.newDisplayBox).removeClass('shown');
			}
			
			console.log("BLURRING NOTE");
			canvas.activeNote.blur();
		 
		}
		
	}

 
}

// -----------------------------------------------------------------------------
// USER OBJECT
// -----------------------------------------------------------------------------

function objUser() {
    this.username = null;
    this.email = null;
    this.firstname = null
    this.lastname = null;
}

// -----------------------------------------------------------------------------
// CANVAS OBJECT
// -----------------------------------------------------------------------------

function objCanvas() {
	this.pane = document.getElementById("canvas");
	this.movingNote = null;
	this.activeNote = null;
	this.mouseX = null;
	this.mouseY = null;
	this.pendingColor = null;

	this.newNote = canvasNewNote;
	this.newNoteList = canvasNewNoteList;
	
	this.loadNote = canvasLoadNote;
	this.setMouseXY = canvasSetMouseXY;
	this.removeActive = canvasRemoveActive;
	this.blurAny = blurAny;
	this.setActiveNoteColor = canvasSetActiveNoteColor;
}

// -----------------------------------------------------------------------------
// CANVAS OBJECT METHODS
// -----------------------------------------------------------------------------

// repurposing image for 'note type' - so 2 becomes list note
function canvasNewNote(color, pos, image, filename) {
	 
 
	if (pos == null){
		var pos = placeNewNote();
	}

	// define default size for new text note
	if (parseInt(image) != 1) { // text note
		var width = noteDefaultWidth;
		var height = noteDefaultHeight;
	}
	if (parseInt(image) == 2) { // text note
		var height = todoNoteDefaultHeight;
	}
		
	var newNote = new objNote("", color, pos.x, pos.y, width, height, null, image, filename);	
	
	notes.push(newNote);	// Index should correspond with noteCounter


	canvas.pane.className = canvas.pane.className;	// Force Internet Shitsplorer to redraw
	
	var zIndex = newNote.zIndex();
	

	if (parseInt(image) == 1) {
		width = newNote.imageBox.width;
		height = newNote.imageBox.height;
		console.log("image width:" + width);
		console.log("image height:" + height);
	}
		//console.log("here3");

		Ajax.createNote({
			color: color,
			x_position: pos.x,
			y_position: pos.y,
			width: width,
			height: height,
			z_index: zIndex,
			content: "",
			file: parseInt(image),
			image: parseInt(image),
			filename: filename
		}, newNote);
	
	// only want editable ON CREATION if this is a text note
	if (parseInt(image) != 1) {
		newNote.edit();
	}
	
	return newNote;
}

// repurposing image for 'note type' - so 2 becomes list note
function canvasNewNoteList(color, pos, image, filename) {
	 

	if (pos == null){
		var pos = placeNewNote();
	}

	// define default size for new text note
	if (parseInt(image) != 1) { // text note
		var width = noteDefaultWidth;
		var height = noteDefaultHeight;
	}
		
	var newNote = new objNote("", color, pos.x, pos.y, width, height, null, image, filename);	
	
	notes.push(newNote);	// Index should correspond with noteCounter


	canvas.pane.className = canvas.pane.className;	// Force Internet Shitsplorer to redraw
	
	var zIndex = newNote.zIndex();
	

	if (parseInt(image) == 1) {
		width = newNote.imageBox.width;
		height = newNote.imageBox.height;
		console.log("image width:" + width);
		console.log("image height:" + height);
	}
		//console.log("here3");
	
		Ajax.createNote({
			color: color,
			x_position: pos.x,
			y_position: pos.y,
			width: width,
			height: height,
			z_index: zIndex,
			content: "",
			file: parseInt(image),
			image: parseInt(image),
			filename: filename
		}, newNote);
	
	// only want editable ON CREATION if this is a text note
	if (parseInt(image) != 1) {
		newNote.edit();
	}
//	alert(console.log(newNote));
	return newNote;
	
}


function canvasLoadNote(content, color, x, y, width, height, dbId, zIndex, image, filename){
	var newNote = new objNote(content, color, x, y, width, height, dbId, image, filename);
	//alert("load note is image:" + image)
	newNote.zIndex(zIndex);
 	notes.push(newNote);	// Index should correspond with noteCounter	
 	return newNote;
}

function canvasMouseDown(e) {

	console.log("CANVAS MOUSE DOWN");
    if (noteCancelBtn.active == true) {
        noteCancelBtn.hide();
    }

    if (canvas.activeNote != null) {
    	console.log("ACTIVE NOTE TOGGLE INPUT");
		canvas.activeNote.toggleInput();
    }
}

function canvasMouseMove(e) {
    if (noteCancelBtn.active == true) {
        noteCancelBtn.hide();
    }
}

function canvasSetMouseXY(e) {
	this.mouseX = getMouseX(e);
	this.mouseY = getMouseY(e);
}

function canvasRemoveActive() {
	console.log("CANVAS REMOVE ACTIVE");
	if (this.activeNote != null) {
		var target = this.activeNote;		
		target.blur();
		target.kill();		
	}
}

function canvasSetActiveNoteColor(color){
	if (this.activeNote != null){
		this.activeNote.setColor(color);
	}
}

// -----------------------------------------------------------------------------
// NOTE OBJECT
// -----------------------------------------------------------------------------

function objNote(content, color, x, y, width, height, dbId, image, filename) {
	
	this.index = noteCounter++;
	this.id = "note" + noteCounter;
 	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.color = color;
	this.content = content;
	this.dbId = dbId;
	this.image = image;
	this.filename = filename;

	
	
	
	this.contentBox = null;
	this.displayBox = null;
	this.listUL = null;
	this.newDisplayBox = null;

	this.moving = false;
	this.inputOn = false;
	this.hasMoved = false;
	this.firstUse = true;
	this.saved = false;
	
	this.mouseDown = noteMouseDown;
	//this.mouseUp = noteMouseUp;
	//this.mouseMove = noteMouseMove;
	//this.showButtons = noteShowButtons;
	//this.toggleInput = noteToggleInput;
	
	this.add = noteAdd;
	this.kill = noteKill;
	this.selectable = noteSelectable;
	this.zIndex = noteZIndex;

	// Construct the note
	this.add();
	
	
	// if dimensions passed (load from db) set them
	if (width != null && height != null) {
		$(this.contentBox).css({
			width: width + 'px',
			height: height + 'px'
		});
	
	}	
	

}

// -----------------------------------------------------------------------------
// NOTE OBJECT METHODS
// -----------------------------------------------------------------------------

function noteAdd () { 

	// CREATE NOTE BASE
 
/* $.each( notes, function( key, value ) {
	var keyID; var dbIdss='';
	$.each( value, function( key1, value1 ) {
	if(key1=='id'){
	 keyID=value1;
	}
	if(key1=='dbId'){
	 dbIdss=value1;
	}
	if((key1=='content') && (value1=='')){
	 // alert('k');
	  $('#'+keyID).css('height','20px');
			
	  }
	});

});*/
	console.log("NOTEADD");
	
	var parent = this;
	
	var newNote = document.createElement('div');

	if (parseInt(this.image) == 1) {
		newNote.className = "imageNote noselect note-new note-color-default note-color-" + parent.color;
		addClass(newNote, "noteInvisible");	// hack to make user invisible until fully loaded and resized	
	}
	else if (parseInt(this.image) == 2) {
		newNote.className = "listNote noselect note-new note-color-default note-color-" + parent.color;
		//addClass(newNote, "noteInvisible");	// hack to make user invisible until fully loaded and resized	
		 

	
	}	
	else {
		newNote.className = "note noselect note-new note-color-default note-color-" + parent.color;
	}

	newNote.id = parent.id;
	current_note_id=newNote.id;
	newNote.style.display = 'none';
	 
	$(canvas.pane.appendChild(newNote)).fadeIn('fast', function(){
		$(newNote).css('zIndex', nextZIndex++);
	});
	this.contentBox = newNote;
	this.contentBox.style.left = this.x + "px";
	this.contentBox.style.top = this.y + "px";
	
	// is display box creation even necessary for images? doesn't appendchild
	var displayBox = document.createElement('div');	
	displayBox.className = "displayBox";
	

	
	if (parseInt(this.image) == 2) {  
 		 displayBox.className = "displayBox listItem"; // commented by sipl
	        
			 var notenewid=(newNote.id);
			 $("#text_"+notenewid).focus();
			 
 			 $(".listNote").removeAttr("contenteditable");
			 var newDisplayBox = document.createElement('input');
			 newDisplayBox.type="text";
			// newDisplayBox.value="";
			 newDisplayBox.id="text_"+newNote.id;
			 
			 newDisplayBox.className = "displayBox1 listItem1";
			 this.newDisplayBox = newDisplayBox;
			 newNote.appendChild(newDisplayBox);
			 
			 
			 var newDisplayBox = document.createElement('ul');
 			 newDisplayBox.id="ul_"+newNote.id;
			 newDisplayBox.className = "listNoteUL";
			 
			 this.listUL = newDisplayBox;
			 
			 newNote.appendChild(newDisplayBox);
			 
			 $("#ul_"+newNote.id).append(this.content);
			// $(".listItem1").focus();
			
			
			
 	}
	
	displayBox.id = "displayBox";
	displayBox.innerHTML = this.content;
	this.displayBox = displayBox;
	
	//alert(this.image);
	
	if ((parseInt(this.image) == 0)||(parseInt(this.image) == 2)){ //by sipl ) {

		 if(parseInt(this.image) != 2) {
		 newNote.appendChild(displayBox);
		 }
		 
		   
		 
		 	
	}
	else { 
 		var imageBox = document.createElement('img');	
		newNote.appendChild(imageBox);
		
 		// force resize if dimensions defined (load from db) - might already be doing this elsewhere?
		if ((this.width) && (this.height)) {

			imageBox.style.height = this.height + "px";
			imageBox.style.width = this.width + "px";
			
			// make note visible after resizing completes
			removeClass(newNote, "noteInvisible");	
		}
		else {
		// fancy technique to determine image size - have to loop 
		// waiting for image to complete loading
		
		var loaded = false, wait;

		// event listener to fire when loading complete
		imageBox.addEventListener('load', function () { 
			loaded = true; 
 			console.log(imageBox.width, 'x', imageBox.height); 
 			// make largest dimension constrained to 400px
			// slight bug to rectify with image dimensions as CSS already has 
			// min height and width that can interfere when user resizes
 			if (imageBox.height >= imageBox.width) {
				if (imageBox.height > 400) {
					imageBox.style.height = "400px";
				}
			}
			else if (imageBox.width > imageBox.height) {
				if (imageBox.width > 400) {
					imageBox.style.width = "400px";
				}			

			}
			//alert(1);
			// show note on finished loading
			removeClass(newNote, "noteInvisible");	
			
			console.log("IMAGE FINISHED LOADING, SEND DIMENSIONS TO DB");
			console.log("this.dbId: " + notes[parent.index].dbId);
			console.log("imageBox.width: " + imageBox.width);
			console.log("imageBox.height: " + imageBox.height);
			console.log("this.zIndex: " + notes[parent.index].zIndex());
			
			console.log(Ajax.updateNoteSize({
				db_id: notes[parent.index].dbId,
				width: imageBox.width,
				height: imageBox.height,
				z_index: notes[parent.index].zIndex()
			}));			

		}, true);

		// set wait loop in script that loops waiting for above script to get
		// called on load complete and set loaded var to TRUE
		// I believe this runs asynchronously - all such loops are async in javascript
		// (runs in parallel with remaining execution)
		wait = setInterval(function () {
    		loaded ? clearInterval(wait) : console.log("WAITING ON IMAGE LOAD AND RESIZE");
		}, 0);				


		}
		
		// attach the image - will trigger above event on complete load
		if(this.filename!=''){
		imageBox.setAttribute('src',  "upload/server/php/files/" + this.filename);
		this.imageBox = imageBox;
		}
		
	}

	this.start = noteStart;
	this.stop = noteStop;
	this.edit = noteEdit;
 
	this.blur = noteBlur;
	this.setColor = noteSetColor;
	
	$(newNote).draggable({
		start: function() { notes[parent.index].start(); },		
		stop: function() { notes[parent.index].stop(); }
	});
	
	if (parseInt(this.image) == 1) {
		$(newNote).resizable({
			aspectRatio: true
		})
	}
	
	$(newNote).resizable({
		minHeight: 22,	// seems to apply to both image note and text
		minWidth: 120,	// seems to only affect image notes, normal notes constrained similar to nicpanel
		start: function() { 
			blurAny();
		},	
		resize: function() {
			
			if (parseInt(notes[parent.index].image)== 1) {
				$(notes[parent.index].imageBox).css('height', $(notes[parent.index].contentBox).height());
				$(notes[parent.index].imageBox).css('width', $(notes[parent.index].contentBox).width());	
			}
			
		},
		stop: function() { 
			// if resized too small, force resize to cover all content
			if ($(notes[parent.index].contentBox).height() < $(notes[parent.index].displayBox).height()){
				$(notes[parent.index].contentBox).css('height', 'auto');
			}
			// displaybox is not content for listnote, it's the UL
			if (parseInt(notes[parent.index].image)== 2) {
				if ($(notes[parent.index].contentBox).height() < $(notes[parent.index].listUL).height()){
					$(notes[parent.index].contentBox).css('height', 'auto');
				}	
			}

			Ajax.updateNoteSize({
				db_id: notes[parent.index].dbId,
				width: $(notes[parent.index].contentBox).width(),
				height: $(notes[parent.index].contentBox).height(),
				z_index: notes[parent.index].zIndex()
			});
		}			
	});
	
	$(newNote).click(function(event) {
  	    current_note_id=newNote.id; 
		 
		stopBubble(event);
		notes[parent.index].edit();
		
		// BAD CODE FROM ODESK DEVELOPER
		// CREATE THE TO DO LIST KEYPRESS EVENT, FOR SOME REASON NEEDS TO BE CALLED FROM VARIOUS PLACES
		// TO REWRITE, RIGHT NOT JUST FACTORED

		initTodoKeypress();		
		
    });
/*	$(newNote).blur(function(event) {
 alert('newblur');
 });*/
	
	$(newNote).mousedown(function(event){
		notes[parent.index].mouseDown(event);
	});
	
	$(newNote).keydown(function(event){ //alert(parent.index);
	                var j=parent.index;
					var t=j+1;
	                $('#note'+t).css('height', 'auto'); 
					
		          $('#activeListInput').css('min-height', '50px;');
 				  
		 if (event.keyCode == 13){ //alert(2);
			if ($(notes[parent.index].contentBox).height() < $(notes[parent.index].displayBox).height()){
				$(notes[parent.index].contentBox).css('height', 'auto'); 
				//$('#note9').css('height', 'auto'); 
		        // $('#activeListInput').css('min-height', '50px;');
 			} 			
		  }
		 if (event.keyCode == 9){ //alert(2);
			event.preventDefault();		
		  }
		
		
	});
//	$('#target').blur(function() {
			//$(newNote).blur(function(event){

	
	console.log("NOTEADD END");
	
}

function noteSetColor(color) {
	this.color = color;
	
	
	$(this.contentBox).removeClass(function(){
		var toRemove = '';
		var classList = $(this).attr('class').split(/\s+/);
		$.each( classList, function(index, item){
			if (item.match(/^note\-color\-/)) {
				toRemove += item + ' ';
			}
		});
		return toRemove;
	}).css('filter', '').addClass('note-color-default note-color-'+color);
	
	
	
	Ajax.updateNoteColor({
		db_id: this.dbId,
		color: color
	});
	
}

function noteStart() { 	
	canvas.movingNote = this;
	canvas.movingNote.X = canvas.movingNote.contentBox.offsetLeft;
	canvas.movingNote.Y = canvas.movingNote.contentBox.offsetTop;
	
	$(this.contentBox).addClass('active');

}



function noteEdit() {

	console.log("NOTE EDIT");

	if (canvas.activeNote != this) {
		canvas.blurAny();
		this.selectable(true);
		canvas.activeNote = this;
		
		if (canvas.pendingColor != null){
			this.setColor(canvas.pendingColor);
			canvas.pendingColor = null;
			return;
		}
		
		$('.note').not(this.contentBox).removeClass('active editable');
		$(this.contentBox).draggable('disable').addClass('active editable').css({zIndex: nextZIndex++});
		
		//if (parseInt(this.image) != 2) { // text note
			noteNicEditor.addInstance(this.displayBox);	
			
			$(this.displayBox).addClass('activeListInput');
						 
			$(".nicEdit-buttonContain").css('display', '');
			$(".nicEdit-selectContain").css('display', '');				 
			
		//}

			//$("#nicPanel").css('width', this.contentBox.offsetWidth + "px");

			nicPanel.children[1].style.width = this.contentBox.offsetWidth + "px";
			nicPanel.style.width = this.contentBox.offsetWidth + "px";	
			console.log ("this.contentBox.offsetWidth " + this.contentBox.offsetWidth);
			console.log ("this.contentBox.id " + this.contentBox.id);

			nicPanel.style.display = "inline";	
			nicPanel.style.left = this.contentBox.offsetLeft + "px";
	
			nicPanel.style.top = getObjY(this.contentBox) - nicPanel.offsetHeight + "px";	
			
			if ($.trim($(this.displayBox).text()) == ''){
				$(this.displayBox).html('');	// Bugfix 2012-05-14
			}
			
			setEndOfContenteditable(this.displayBox);
			//current_note_id=this.id;
	        //selectedNoteId=this.id;
			// alert(selectedNoteId);
			// mainly for images so that container forms when elements are hidden but
			// kept to be consistent height for both text and image
			$(".nicEdit-panelContain").css('height', '24px');


    $(".listItem").keypress(function (e) {    $(".listItem").removeAttr("contenteditable");
    	
      console.log("LISTITEM KEYPRESS");
      
      if (e.which == 13) {
			var newDisplayBox = document.createElement('div');
			newDisplayBox.className = "displayBox listItem";
			$('#note1').append(newDisplayBox);
			//newDisplayBox
			noteNicEditor.addInstance(newDisplayBox);
			$(newDisplayBox).focus();				
      }
      
      if (e.which == 32 || (65 <= e.which && e.which <= 65 + 25)
                        || (97 <= e.which && e.which <= 97 + 25)) {
        var c = String.fromCharCode(e.which);
        //$("p").append($("<span/>"))
        //      .children(":last")
        //      .append(document.createTextNode(c));
      } else if (e.which == 8) {
        // backspace in IE only be on keydown
        //$("p").children(":last").remove();
      }
      //$("div").text(e.which);
    });



		//}

		if ((parseInt(this.image) == 1)||(parseInt(this.image) == 2)) { // text note
			$(".nicEdit-buttonContain").css('display', 'none');
			$(".nicEdit-selectContain").css('display', 'none');	
			
			//nicPanel.children[1].style.width = this.imageBox.width + "px";
			//nicPanel.style.width = this.imageBox.height + "px";	
			
			// for some reason this isn't getting called for image notes - explicity override
			//$(this.imageBox).addClass('active');
								 
		}


		if ($(this.contentBox).hasClass('note-new')){
			$(this.contentBox).removeClass('note-new');
		}
	}

	// ======================================
	// SET FOCUS
		
	if (parseInt(this.image) == 2) { // IF TO DO LIST FOCUS ON FIRST ENTRY FEED
		//addClass(this.newDisplayBox, 'shown');
		$(this.newDisplayBox).addClass('shown');
		$(this.newDisplayBox).focus();
	}
	else {
		$(this.displayBox).focus();
	}
	
}

function noteStop() {
	this.x = canvas.movingNote.contentBox.offsetLeft;
	this.y = canvas.movingNote.contentBox.offsetTop;
	
	// Snap back to reality
	var pos = checkScreenPosition({x: this.x, y: this.y}, {w: $(this.contentBox).width(), h: $(this.contentBox).height()});
	canvas.movingNote.contentBox.style.left = pos.x + 'px';
	canvas.movingNote.contentBox.style.top = pos.y + 'px';
	
	Ajax.updateNotePosition({
		db_id: this.dbId,
		x_position: pos.x,
		y_position: pos.y,
		z_index: this.zIndex()
	});
	
	canvas.movingNote = null;
	$(this.contentBox).removeClass('active');
}

function noteBlur() {
  	
  	console.log("webnotes.js noteBlur");
  		
	noteNicEditor.removeInstance(this.displayBox);
	this.content = this.displayBox.innerHTML;
	this.displayBox.blur();
      //alert($("#"+this.id).hasClass("listNote"));
	// if and else case added by sipl to check if its list or note . if list return false without action;
	
 	if($("#"+this.id).hasClass("listNote")==false){
	   Ajax.updateNoteContent({
			db_id: this.dbId,
			content: this.content,
			z_index: this.zIndex()
		});
	}
	
		Ajax.updateNoteSize({
			db_id: this.dbId,
			width: $(this.contentBox).width(),
			height: $(this.contentBox).height(),
			z_index: this.zIndex()
		});
		
		$(this.contentBox).draggable("enable").removeClass('active editable');
		this.selectable(false);
		nicPanel.style.display = "none";
		canvas.activeNote = null;
	
}

function saveActiveNote(){	// Rebadged version of noteBlur save
	if (canvas.activeNote != null){
		canvas.activeNote.content = canvas.activeNote.displayBox.innerHTML;
		Ajax.updateNoteContent({
			db_id: canvas.activeNote.dbId,
			content: canvas.activeNote.content
		});
	}
}

function noteZIndex(setZIndex){
	if (setZIndex == null){
		return $(this.contentBox).css('zIndex');
	}
	else {
		$(this.contentBox).css('zIndex', setZIndex);
	}
}

function noteKill() {
	// NEED A FIX HERE FOR NOTES CREATED BEFORE USER SIGNS UP - NOT DELETED FROM NOTES ARRAY OBJECT
	console.log("NOTE KILL");
	console.log(notes[this.index]);
	
	canvas.pane.removeChild(this.contentBox);
	delete notes[this.index];
	Ajax.deleteNote({
		db_id: this.dbId
	});
}

function noteSelectable(isSelectable){
	if (isSelectable){
		$(this.contentBox).removeClass('noselect');
	}
	else {
		$(this.contentBox).addClass('noselect');
	}
}


function noteMouseMove(e) {

	if (canvas.movingNote != null) {

		canvas.movingNote.hasMoved = true;
		canvas.movingNote.div.style.left = canvas.movingNote.div.offsetLeft + getMouseX(e) - canvas.mouseX + "px";
		canvas.movingNote.div.style.top = canvas.movingNote.div.offsetTop + getMouseY(e) - canvas.mouseY + "px";
		canvas.movingNote.X = canvas.movingNote.div.offsetLeft;
		canvas.movingNote.Y = canvas.movingNote.div.offsetTop;
	
		canvas.setMouseXY(e);

	}
	else if (this.inputOn == false) {

		this.showButtons();
	}
	
	stopBubble(e);
}


function noteMouseDown(e) {
	stopBubble(e);
	$(this.contentBox).css({zIndex: nextZIndex++});
	if (canvas.activeNote && canvas.activeNote.id != this.id){
		canvas.blurAny();
	}
}



function noteShowButtons() {
	noteCancelBtn.show(this);
}



function noteToggleInput () {

    if (this.inputOn == false) {
            this.inputOn = true;
            canvas.activeNote = this;
            this.hasMoved = false;
            //this.displayBox.style.display = "none";
            this.inputBox.style.display = "";
            this.inputBox.focus();
            if (this.firstUse == true) {
                    this.firstUse = false;
                    this.inputBox.select();
            }
    }
    else if (this.inputOn == true) {
            this.inputOn = false;
            canvas.activeNote = null;
            this.content = this.inputBox.value;
            //this.displayBox.innerHTML = this.content;
            //this.displayBox.style.display = "";
            this.inputBox.style.display = "none";
            if (this.content.length > 28) {
                    this.listDiv.innerHTML = this.content.slice(0,28) + "...";
            }
            else {
                    if (this.listDiv.innerHTML != this.content) {
                            this.listDiv.innerHTML = this.content;
                            this.save();
                    }
            }
    }
}




function noteSave() {
	
}

// -----------------------------------------------------------------------------
// NOTE CREATION SMART PLACEMENT
// -----------------------------------------------------------------------------

/**
 *	Returns the recommended note placement position
 *	Checks for overlap with existing notes
 * 	
 *	Disregarding the navbar is OK because this function compares relatively
 */
function placeNewNote(displaceBy){
	if (displaceBy == null){
		var displaceBy = 0;
	}
	else if (displaceBy > 30){
		alert('Looks like you have a lot of notes! Consider clearing some to improve application performance.');
		return {x: 25, y: 25};
	}
	
	var position = {x: 25+(10*displaceBy), y: 25+(10*displaceBy)};
	var pageSize = getPageSize();
	if (notes.length > 0){
		for (i in notes){	// Position next to first note
			var n = notes[i];
			var pos_ok = true;
			for (j in notes){	// Loop through all notes
				var m = notes[j];
				if (position.x == m.x){		// Is inside a note
					if (position.y == m.y){
						pos_ok = false;
					}
				}
			}
			if (pos_ok){
				if (checkScreenPosition(position, null, true)){
					displaceBy++;
					position = placeNewNote(displaceBy);
				}
				return position;
			}
			if ((position.x + (noteDefaultOuterWidth * 2) + 10) < pageSize.pageWidth){
				position.x += noteDefaultOuterWidth + 10;
			}
			else {
				position.x = 25+(10*displaceBy);
				position.y += noteDefaultOuterHeight + 10;
			}
		}
	}
	if (checkScreenPosition(position, null, true)){
		displaceBy++;
		position = placeNewNote(displaceBy);
	}
	return position;
}

/**
 *	Check for offscreen
 * 	If there is offscreen, calculate a visible position
 */
function checkScreenPosition(position, dim, returnBoolean){
	if (dim == null)
		var dim = {w: noteDefaultOuterWidth, h: noteDefaultOuterHeight}
	if (returnBoolean == null)
		var returnBoolean = false;
	else
		returnBoolean = !!returnBoolean;

	var isOffscreen = false;
	var pageSize = getPageSize();
	if ((position.x + dim.w - 20) < 0){
		position.x = (0 - dim.w + 20);
		isOffscreen = true;
	}
	if ((position.x + 20) > pageSize.windowWidth){
		position.x = (pageSize.windowWidth - 20);
		isOffscreen = true;
	}
	if ((position.y + dim.h - 20) < navbarDefaultHeight){
		position.y = (navbarDefaultHeight - dim.h - 20);
		isOffscreen = true;
	}
	if ((position.y + 20) > (pageSize.windowHeight - navbarDefaultHeight)){
		position.y = (pageSize.windowHeight - navbarDefaultHeight - 20);
		isOffscreen = true;
	}
	
	if (returnBoolean)
		return isOffscreen;
	else 
		return position;
}
 
function getPageSize() {
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}
	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}
	return {pageWidth: pageWidth, pageHeight: pageHeight, windowWidth: windowWidth, windowHeight: windowHeight};
};


// -----------------------------------------------------------------------------
// NOTE BUTTONS OBJECT
// -----------------------------------------------------------------------------

function objNoteCancelBtn() {

	this.showingNote = null;

	div = document.createElement('div');
	div.id = "noteCancelBtn";
	div.onmousedown = function(e) { noteCancelBtn.showingNote.kill(); }	
	//div.onmousemove = function(e) { notes[newNote.id].mouseMove; }
	document.getElementById("buttonElements").appendChild(div);	
	noteCancelBtnDiv = document.getElementById("noteCancelBtn");
	noteCancelBtnDiv.style.display = "none";
	
	this.active = false;
	this.contentBox = noteCancelBtnDiv;
	this.show = btnShow;
	this.hide = btnHide;
	
}

function btnShow(note) {
	this.showingNote = note;
	this.active = true;
	noteCancelBtn.div.style.left = note.div.offsetLeft + note.div.offsetWidth - 50 + "px";		
	noteCancelBtn.div.style.top = note.div.offsetTop + 10 + "px";	
	noteCancelBtn.div.style.display = "";	
}


function btnHide() {
	this.showingNote = null;
	this.active = false;
	noteCancelBtn.div.style.display = "none";	
}


// -----------------------------------------------------------------------------
// NOTELIST OBJECT
// -----------------------------------------------------------------------------

function objNoteList() {
 
	this.mouseMove = noteListMouseMove;
}

function noteListMouseMove(e) {

}

function noteListItemMouseMove(e) {

}



function blurAny() {
	if (canvas.activeNote != null) {

		// hide to do input box while blurring
		if (parseInt(canvas.activeNote.image) == 2) { 
			$(canvas.activeNote.newDisplayBox).removeClass('shown');
		}		
	
		canvas.activeNote.blur();
		 
	}
}


// -----------------------------------------------------------------------------
// SIGNUP FORM OBJECT
// -----------------------------------------------------------------------------


function objSignupForm() {
    this.visible = false;
    this.contentBox = document.getElementById('mainForm');
    this.message = document.getElementById('signupMessage');
    this.show = signupShow;
    this.hide = signupHide;
    this.freeze = signupFreeze;
    this.unfreeze = signupUnfreeze;
    this.submit = signupSubmit;
    this.message = signupMessage;
    this.success = signupSuccess;
    this.clear = signupClear;
}

function signupShow() {
   //document.body.style.overflow =  'hidden'
    overlay.style.display = 'block';
    this.contentBox.style.display = 'inline';
	document.getElementById("mainFormContent").style.display = "none";	
	document.getElementById("signupForm").style.display = "block";
}

function signupHide() {
    //document.body.style.overflow =  'scroll'
    overlay.style.display = 'none';
    this.contentBox.style.display = 'none';
    this.unfreeze();
    this.clear();
}

function signupSubmit() {

    var email = document.getElementById('textEmail').value;
    var password = document.getElementById('textPassword').value;

}

function signupMessage(msg) {
    document.getElementById('signupMessage').innerHTML = msg;
    this.unfreeze();
}

function signupFreeze() {
    document.getElementById('textEmail').enabled = false;
    document.getElementById('textPassword').enabled = false;
    document.getElementById('btnSubmitSignup').enabled = false;
}

function signupUnfreeze() {
    document.getElementById('textEmail').enabled = true;
    document.getElementById('textPassword').enabled = true;
    document.getElementById('btnSubmitSignup').enabled = true;
}

function signupClear() {
    document.getElementById('textEmail').value = "";
    document.getElementById('textPassword').value = "";
    document.getElementById('signupMessage').innerHTML = "";
}

function signupSuccess() {
	console.log("NOTELY.JS signupSuccess()");
	document.getElementById("mainForm").style.display = "none";
	loginForm.success();
    user.email = document.getElementById('textEmail').value;
	buttonsLoggedIn();
	console.log("signupSuccess()");
}




// -----------------------------------------------------------------------------
// LOGIN FORM OBJECT
// -----------------------------------------------------------------------------


function objLoginForm() {
    this.visible = false;
    this.contentBox = document.getElementById('loginForm');
    this.message = document.getElementById('loginMessage');
    this.show = loginShow;
    this.hide = loginHide;
    this.freeze = loginFreeze;
    this.unfreeze = loginUnfreeze;
    this.submit = loginSubmit;
    this.message = loginMessage;
    this.success = loginSuccess;
    this.clear = loginClear;
}

function loginShow() {
    //document.body.style.overflow =  'hidden'
    overlay.style.display = 'block';
    this.contentBox.style.display = 'inline';
}

function loginHide() {
    //document.body.style.overflow =  'scroll'
    overlay.style.display = 'none';
    this.contentBox.style.display = 'none';
    this.unfreeze();
    this.clear();
}

function loginSubmit() {

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

}

function loginMessage(msg) {
    document.getElementById('loginMessage').innerHTML = msg;
    this.unfreeze();
}

function loginFreeze() {
    document.getElementById('loginEmail').enabled = false;
    document.getElementById('loginPassword').enabled = false;
    document.getElementById('btnSubmitLogin').enabled = false;
}

function loginUnfreeze() {
    document.getElementById('loginEmail').enabled = true;
    document.getElementById('loginPassword').enabled = true;
    document.getElementById('btnSubmitLogin').enabled = true;
}

function loginClear() {
    document.getElementById('loginEmail').value = "";
    document.getElementById('loginPassword').value = "";
    document.getElementById('loginMessage').innerHTML = "";
}

function loginSuccess() {


    //document.getElementById('signupMessage').innerHTML = msg;
    user.email = document.getElementById('loginEmail').value;
    //this.unfreeze();
    this.hide();
	
	
	loginSuccessForm.style.display = "inline";
	
	buttonsLoggedIn();

	// dynamically load render notes php, that creates the notes via js for this user's session.
	// old code
	//var file = document.createElement('script');
	//file.setAttribute("type","text/javascript");
	//file.setAttribute("src", "rendernotes.js.php");
	//document.getElementsByTagName("head")[0].appendChild(file);
	//document.body.appendChild(file);
	loginSuccessForm.style.display = "none";
	
	//fileUploadInit();
	

	//$('#sharebar').css('display', 'inline');
	
	console.log("NOTELY.JS loginSuccess() FINISH");
	
	
}

function buttonsLoggedIn() {
	document.getElementById('loginBtn').style.display = "none";
    document.getElementById('signupBtn').style.display = "none";
    document.getElementById('loggedInBtn').style.display = "inline";
    document.getElementById('logoutBtn').style.display = "inline";
    document.getElementById('userNameBtn').style.display = "inline";		
    document.getElementById('userName').innerHTML = user.email;
}


function hideObj(obj) {
	addClass(obj, "hidden");
}


function logout() {
    ajaxState = 'AWAITING_LOGOUT_RESPONSE';
    ajaxCall("action=logout");	
}


// SHOWLOADER

function showLoader() {
	//console.log(window.innerWidth - 100);
	loaderObj.style["left"] = window.innerWidth - 160 + "px";
	loaderObj.style["top"] = window.innerHeight - 150 + "px";
	cl.show();
	
}
function hideLoader() {
	cl.hide	();
}

// HIDELOADER



// ------------------------------------------------
// GENERIC FUNCTIONS
// ------------------------------------------------

// STOP EVENT PROGATION
function stopBubble(e)
{
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	//alert("stop bubble!");
}	

function getObjY(obj)
{
var curtop = 0;
if(obj.offsetParent)
	while(1)
	{
	  curtop += obj.offsetTop;
	  if(!obj.offsetParent)
		break;
	  obj = obj.offsetParent;
	}
else if(obj.y)
	curtop += obj.y;
return curtop;
}

function getObjX(obj)
{
var curleft = 0;
if(obj.offsetParent)
	while(1) 
	{
	  curleft += obj.offsetLeft;
	  if(!obj.offsetParent)
		break;
	  obj = obj.offsetParent;
	}
else if(obj.x)
	curleft += obj.x;
return curleft;
}




/*
============================================================
Capturing The Mouse Position in IE4-6 & NS4-6
(C) 2000 www.CodeLifter.com
Free for all users, but leave in this  header
*/

// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
//document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

function getMouseX(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft
  } else {  // grab the x-y pos.s if browser is NS
    tempX = e.pageX
  }  
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY
  //document.Show.MouseX.value = tempX
  //document.Show.MouseY.value = tempY
  return tempX
}


function getMouseY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempY = e.pageY
  }  
  // catch possible negative values in NS4
  if (tempY < 0){tempY = 0}  
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY
  //document.Show.MouseX.value = tempX
  //document.Show.MouseY.value = tempY
  return tempY
}


// ADD/REMOVE CLASSES


function SetCursorToTextEnd(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}



function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}
function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}



// =======================
// TOOLTIP FUNCTIONS
// =======================

function hideIntroTooltips() {
	$('#ui-tooltip-intro-left').fadeOut(400, function() {});

  	$('#ui-tooltip-intro-right').fadeOut(400, function() {});
} 




function initTodoKeypress() {

		$(".listItem1").keypress(function(e) { 
		
		console.log("LISTITEM KEYPRESS3");
		
						var txtid=(this.id);
						var myArray = txtid.split('_');
						var commonPostfix=myArray[1];
						
						
						if ( e.which == 13 ) {
								
						e.preventDefault();
						var thecode = e.keyCode || e.which; 
						var txt=$("#"+txtid).val();
						//var id= num;
						
						//var l=$("#ul_"+commonPostfix).getElementsByTagName('li').length;
						 var l=$('ul#ul_'+commonPostfix+' li').length; 
 						
						 
						 if(l>0){
						 var lastLiId=($('ul#ul_'+commonPostfix+' li:last').attr('id')  );
						 // alert(lastLiId);
						  var lisplt= lastLiId.split('_');
						   var newl= parseInt(lisplt[2]);
						  // alert(newl);
						 var id=newl+1;
						 }else{
							 
							 var id=l+1; 
						 }
						 
						// $('ul#someList li:first')
						 //alert($('#ul_'+commonPostfix).last().css('background-color', 'red'));
						 	/*	$("#ul_"+commonPostfix).append("<li id='li_"+id+"' > <input type='checkbox' name='complete' id='complete'  value='1' /> "+txt+"<span style='cursor:pointer;' title='delete' id='spn_"+id+"'  onclick='deleteLine(\""+id+"\");'>&nbsp;&nbsp;&nbsp;X<span></li>");
						 */
						  var notedbid=canvas.activeNote.dbId;  
						   if(txt!=''){  
$("#ul_"+commonPostfix).append("<li class='todoli' id='li_"+notedbid+"_"+id+"' > <input class='listNoteCheckbox' type='checkbox' name='complete' id='complete_"+id+"' value='1' onclick='markLine(\""+notedbid+"\",\""+id+"\");' /><div class='todoContent'>"+txt+"</div><div class='todoListDelete' style='cursor:pointer;' title='delete' id='delete_"+notedbid+"_"+id+"'  onclick='deleteLine(\""+notedbid+"\",\""+id+"\");'>&nbsp;&nbsp;&nbsp;x<div></li>");
 						
					 
						// insert lines into db  
						 $.post("submit.php",{ action: "addline", notelistid:commonPostfix,content:txt,notedbid:notedbid,lineid:'li_'+notedbid+'_'+id } , function(data) {
						// alert( data);
						
						});
 	
						   }
						
						$("#"+txtid).val('');
						$("#"+txtid).focus();	
						//num++;
			
						}
						
				});	
				
}

// ========================
// SPINNING LOADER GRAPHIC - RUNS STANDALONE ON CODE LOAD
// =======================
	
// This script creates a new CanvasLoader instance and places it in the wrapper div -->

var cl = new CanvasLoader('canvasloader-container');
cl.setDiameter(41); // default is 40
cl.setDensity(60); // default is 40
cl.setRange(0.5); // default is 1.3
//cl.show(); // Hidden by default

// This bit is only for positioning - not necessary
var loaderObj = document.getElementById("canvasLoader");
loaderObj.style.position = "absolute";
loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";

//cl.hide(); // Hidden by default
	





