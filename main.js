$(() => {

  setup();

})

function setup(boardColor){
  
  for (let i=0;i<8;i++){
    $('.checkerBoard').append('<tr row="'+i+'"></tr>');
    for (let j=0;j<8;j++){
      let color = 'black';
      if ((i+j)%2 === 0){color = 'white'};
      $('.checkerBoard tr[row='+i+']').append('<td class="cell '+color+'" row="'+i+'" col="'+j+'"></td>');
    }
  }

  for (let i=0; i<4; i++) {
    for (let j=0;j<3;j++) {
      $('.checkerBoard [row='+(i*2+(j%2))+'][col='+j+']').append('<div class="men black"><div class="theKing">&#9812;</div></div>');
      $('.checkerBoard [row='+(i*2+((j+1)%2))+'][col='+(7-j)+']').append('<div class="men red"><div class="theKing">&#9812;</div></div>');
    }
  }

   $('.men').draggable({
      containment: '.checkerBoard',
      cursor: 'move',
      revert: true,
      start: findCells,
      stop: removeIt,
      helper: myHelper
    });
  
  $('.men.'+ boardColor).draggable('able');
}
function findCells(event, ui){
 
  let row = parseInt($(this).parent().attr('row'));
  let col = parseInt($(this).parent().attr('col'));
  let dir = 1;
  let color = 'black';
  if ($(this).hasClass('red')){
    dir = -1;
    color = 'red';
  }
  men = $(this);
  checkCells(men,row,col,dir,color,0);
}

function checkCells(men,row,col,dir,color,double){
  if (men.hasClass('king')){
    checkCell(row,col,1,dir*-1,color,double);
    checkCell(row,col,-1,dir*-1,color,double);
  }
  checkCell(row,col,1,dir,color,double);
  checkCell(row,col,-1,dir,color,double);
}

function checkCell(row,col,step,dir,color,double){
  if ($('.cell[row='+(row+step)+'][col='+(col+dir)+'] .men').length > 0){
    if (!$('.cell[row='+(row+step)+'][col='+(col+dir)+'] .men').hasClass(color)){
      if ($('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+'] .men').length === 0){
        $('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+']').addClass('active');
      }
    }
  }
  else if (double === 0){
    $('.cell[row='+(row+step)+'][col='+(col+dir)+']').addClass('active');
  }
  $('.active').droppable({
    accept: '.men',
    hoverClass: 'hovered',
    drop: menDrop
  });
}

function menDrop(event, ui){
  let oldCol = parseInt(ui.draggable.parent().attr('col'));
  let oldRow = parseInt(ui.draggable.parent().attr('row'));
  let newRow = parseInt($(this).attr('row'));
  let newCol = parseInt($(this).attr('col'));
  
  removeIt();
  $(this).append(ui.draggable);
  $('#draggableHelper').remove();
  
  let color = 'black';
  if (ui.draggable.hasClass('red')){color = 'red';}
  
  if (Math.abs(oldRow-newRow) === 2 || Math.abs(oldCol-newCol) === 2){
    jumpmen(ui.draggable,color,oldRow,oldCol,newRow,newCol);}
  
  if (color === 'black' && newCol ===7){ui.draggable.addClass('king');}
  else if (color === 'red' && newCol === 0){ui.draggable.addClass('king');}
    
  if ($('.active').length === 0){
    if (ui.draggable.hasClass('red')){
      $('.men.red').draggable('disable');
      $('.men.black').draggable('enable');
    }
    else{
      $('.men.black').draggable('disable');
      $('.men.red').draggable('enable');
    }
  }
  else {
      $('.men').draggable('disable');
      ui.draggable.draggable('enable');
  }
}

function removeIt(event, ui){
  $('.active').droppable('destroy');
  $('.active').removeClass('active');
}

function jumpmen(men,color,oldRow,oldCol,newRow,newCol){
  $('.cell[row='+(oldRow+(newRow-oldRow)/2)+'][col='+(oldCol+(newCol-oldCol)/2)+'] .men').remove();
  checkCells(men,newRow,newCol,(newCol-oldCol)/2,color,1);
    
  if ($('.men').length - $('.men.'+color).length === 0){winner(color);}
}

function myHelper( event ) {return '<div id="draggableHelper" class="men"></div>';}

function winner(color){
  if (color === 'red'){$('.winner').html('You Win!');}
  else{$('.winner').html('You Win!');}
  
  $('.men').draggable('disable');
}
