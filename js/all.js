var elValHeight = document.getElementById('js--height');
var elValWeight = document.getElementById('js--weight');
var elValresult = document.getElementById('resultBtn');
var elDelete = document.getElementById('listDelete');
var elListDefault = document.getElementById('js--defaultList');
var elreset = document.querySelector('.header__result__showWrap');
var elresultWrap = document.querySelector('.header__result__inputwrap');

var bmi = [];
var bmiStatusTxtAry = [];
var bmiStatusColorAry = [];
var btnstatus = '';

//監聽
updateList();
elValresult.addEventListener('click', getResult);
elValHeight.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    getResult();
  }
});
elValWeight.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    getResult();
  }
});
elDelete.addEventListener('keydown', deleteList);


function getResult() {
  //timeSet
  let time = new Date();
  let tYear = time.getFullYear().toString();
  let tMonth = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1);
  let tDate = (time.getDate()) > 9 ? (time.getDate()).toString() : '0' + (time.getDate());
  let curentTime = tYear + '-' + tMonth + '-' + tDate;

  let heightInCm = elValHeight.value;
  let heightValInM = heightInCm * heightInCm * 0.0001;
  let weightVal = elValWeight.value;
  let height = (Math.round(heightInCm * 100) / 100).toFixed(2);
  let weight = (Math.round(weightVal * 100) / 100).toFixed(2);
  let result = (Math.round(weightVal / heightValInM * 100) / 100).toFixed(2);
  let data = {
    'bmi': result,
    'weight': weight,
    'heightInCm': height,
    'date': curentTime
  };
  if (heightInCm !== '' && weightVal !== '') {
    getData();
    bmi.push(data);
    saveData();
    updateList();
    elValHeight.value = '';
    elValWeight.value = '';

    ///
    headerShowResult();
    let elresetBtn = document.getElementById('reset');
    elresetBtn.addEventListener('click', headerReset);
  } else {
    alert('身高與體重不可為空')
  };
}

function updateList() {
  getData();
  bmiStatusTxtAry = [];
  bmiStatusColorAry = [];
  bmiStatus();
  if (bmi.length == 0) {
    elListDefault.style.display = "flex";
  } else {
    elListDefault.style.display = "none";
    let listStr = '';
    for (let i = 0; i < bmi.length; i++) {
      listStr += `<li class="${bmiStatusColorAry[i]}">
                      <h3>${bmiStatusTxtAry[i]}</h3>
                      <div class="list__wrap">
                        <h4>BMI</h4>
                        <p>${bmi[i].bmi}</p>
                      </div>
                      <div class="list__wrap">
                        <h4>weight</h4>
                        <p>${bmi[i].weight}</p>
                      </div>
                      <div class="list__wrap">
                        <h4>height</h4>
                        <p>${bmi[i].heightInCm}</p>
                      </div>
                      <div class="list__wrap">
                        <h5 class="list__time">${bmi[i].date}</h5>
                      </div>
                  </li>`
    }
    document.querySelector('.main__list').innerHTML = listStr;
  };
}

var statusTxt = '';
function bmiStatus() {
  for (let i = 0; i < bmi.length; i++) {
    var statusColor = '';
    var bmiVal = Number(bmi[i].bmi);
    if (bmiVal < 18.5) {
      statusTxt = '過輕　　';
      statusColor = 'js--status_light';
      btnstatus = 'header__showResult--light';
    } else if (18.5 <= bmiVal && bmiVal < 24) {
      statusTxt = '理想　　';
      statusColor = 'js--status_nice';
      btnstatus = 'header__showResult--nice';
    } else if (24 <= bmiVal && bmiVal < 27) {
      statusTxt = '過重　　';
      statusColor = 'js--status_heavy';
      btnstatus = 'header__showResult--heavy';
    } else if (27 <= bmiVal && bmiVal < 30) {
      statusTxt = '輕度肥胖';
      statusColor = 'js--status_xheavy';
      btnstatus = 'header__showResult--xheavy';
    } else if (30 <= bmiVal && bmiVal < 35) {
      statusTxt = '中度肥胖';
      statusColor = 'js--status_xxheavy';
      btnstatus = 'header__showResult--xxheavy';
    } else {
      statusTxt = '重度肥胖';
      statusColor = 'js--status_xxxheavy';
      btnstatus = 'header__showResult--xxxheavy';
    }
    bmiStatusTxtAry.push(statusTxt);
    bmiStatusColorAry.push(statusColor);
  }
}

function deleteList(e) {
  let num = e.target.value;
  if (num != '' && e.keyCode == 13 && bmi != [] && num != 0) {
    getData();
    bmi.splice(num - 1, 1);
    bmiStatusTxtAry.splice(num - 1, 1);
    bmiStatusColorAry.splice(num - 1, 1);
    saveData();
  }
  if (bmi.length == 0) {
    let listStr = `<li class="js--status_nice defaultList" id="js--defaultList">
    <h3>理想</h3>
    <div class="list__wrap">
      <h4>BMI</h4>
      <p>20.90</p>
    </div>
    <div class="list__wrap">
      <h4>weight</h4>
      <p>20.90</p>
    </div>
    <div class="list__wrap">
      <h4>height</h4>
      <p>20.90</p>
    </div>
    <div class="list__wrap">
      <h5>06-19-2017</h5>
    </div>
    </li>`
    document.querySelector('.main__list').innerHTML = listStr;
  }
  updateList();
  elDelete.value = '';
}

function saveData() {
  let bmiString = JSON.stringify(bmi)
  localStorage.setItem('bmiData', bmiString);
}

function getData() {
  let getData = localStorage.getItem('bmiData');
  let getDataAry = JSON.parse(getData) || [];
  bmi = getDataAry;
}

//控制header button display-none
function headerBtnToggle() {
  elreset.classList.toggle('display--none');
  elresultWrap.classList.toggle('display--none');
}

function headerReset() {
  headerBtnToggle();
}

function headerShowResult() {
  headerBtnToggle();
  str = `<div class="header__showResult  ${btnstatus}">
            <p>${bmi[bmi.length - 1].bmi}</p>
            <h2>BMI</h2>
            <img src="images/icons_loop.png" alt="loopIcon" id="reset">
            <h3 class="result__status">${statusTxt}</h3>
         </div>`;
  elreset.innerHTML = str;
}