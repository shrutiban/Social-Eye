$(document).ready( function() {

  $('body').on("click", "main article div h3", function(){
    if ($(this).children('span').hasClass('close')) {
      $(this).children('span').removeClass('close');
    }
    else {
      $(this).children('span').addClass('close');
    }
    $(this).parent().children('p').slideToggle(250);
    $(this).parent().children('iframe').slideToggle(250);
    $(this).parent().children('form').slideToggle(250);
  });

  $('body').on("click", "nav ul li a", function(){
    var title = $(this).data('title');
    $('.title').children('h2').html(title);
  });

	fetch_persons();
	show_persons();

	fetch_orgs();

	fetch_schedules();
	fetch_posts();


    fetch('/management/donations').then((result) => result.json()).then((res) => {
      console.log(res);
      res['donations'].forEach(function(u){
        let p = document.createElement('div');
        p.innerHTML = "Name:"+u["name"]+"</br>"+"Email:"+u["email"]+"</br>"+"moblie#:"+u["mobile"]+"</br>"+"Amount Donated:"+u["amount"]+"</br>"+"Transaction Details:"+u["status"];
        detailsDiv3.appendChild(p);
      });
    });
});


function fetch_persons() {
	fetch('/management/users/person').then((result) => result.json()).then((res) => {
	    console.log(res);
	    if(res.success){

	      let detailsDiv1 = document.getElementById('detailsDiv1');
	      let selectId = document.getElementById('t_persons');
	      detailsDiv1.innerHTML="";
	      res['users'].forEach(function(u){

	      	let option = document.createElement('option');
	      	option.value = u.username;
	      	option.className = "select__group";
	      	option.innerHTML = u.name;
	      	selectId.appendChild(option);	

	        let p = document.createElement('div');
	        p.innerHTML = "Name:"+u["name"]+"</br>"+"Username:"+u["username"]+"</br>"+"Email:"+u["email"]+"</br>";
	        var button = document.createElement('button');
	        var t = document.createTextNode("Remove Person");
	        button.appendChild(t);
	        button.setAttribute("style", "background-color: red;border:2px solid black;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;");
	        button.addEventListener("click",function(){
	          fetch('/management/deleteUser/person',{
	            method : "POST",
	            body: JSON.stringify(
	            {
	              username : u["username"],
	            }),
	            headers: {"Content-Type" : "application/json;charset=utf-8"}
	          }).then((result) => result.json()).then((res) => {
	            console.log(res);
	            if(res.success){
	              detailsDiv1.removeChild(p);
	            }
	            });
	          swal("Deleted!", "The person has been deleted from the database.", "success");
	        });
	        p.append(button);
	        detailsDiv1.appendChild(p);

	    });
	  }
	});
}

function fetch_orgs() {
	fetch('/management/users/org').then((result) => result.json()).then((res) => {
	  //console.log(res);
	  console.log(res);
	  if(res.success){
	    let detailsDiv2 = document.getElementById('detailsDiv2');
	    detailsDiv2.innerHTML="";
	    res['users'].forEach(function(u){
	      let p = document.createElement('div');
	      p.innerHTML = "Name:"+u["name"]+"</br>"+"Username:"+u["username"]+"</br>"+"Email:"+u["email"]+"</br>";
	      var button = document.createElement('button');
	      var t = document.createTextNode("Remove Org");
	      button.appendChild(t);
	      button.setAttribute("style", "background-color: red;border:2px solid black;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;");
	      button.addEventListener("click",function(){
	        fetch('/management/deleteUser/org',{
	          method : "POST",
	          body: JSON.stringify(
	          {
	            username : u["username"],
	          }),
	          headers: {"Content-Type" : "application/json;charset=utf-8"}
	        }).then((result) => result.json()).then((res) => {
	          console.log(res);
	          if(res.success){
	            detailsDiv2.removeChild(p);
	          }
	          });
	        swal("Deleted!", "The org has been deleted from the database.", "success");
	      })
	      p.append(button);
	      detailsDiv2.appendChild(p);

	  });
	  }
	});
}
function fetch_posts() {
	fetch('/management/posts/posts').then((result) => result.json()).then((res) => {
	  //console.log(res);
	  console.log(res);
	  if(res.success){
	    let detailsDiv4 = document.getElementById('detailsDiv4');
	    detailsDiv4.innerHTML="";
	    res['users'].forEach(function(u){
	      let p = document.createElement('div');
	      p.innerHTML = "User Id:"+u["userId"]+"</br>"+"Description:"+u["description"]+"</br>"+"Phone:"+u["phone"]+"</br>";
	      var button = document.createElement('button');
	      var t = document.createTextNode("Remove Post");
	      button.appendChild(t);
	      button.setAttribute("style", "background-color: red;border:2px solid black;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;");
	      button.addEventListener("click",function(){
	        fetch('/management/deleteUser/org',{
	          method : "POST",
	          body: JSON.stringify(
	          {
	            username : u["username"],
	          }),
	          headers: {"Content-Type" : "application/json;charset=utf-8"}
	        }).then((result) => result.json()).then((res) => {
	          console.log(res);
	          if(res.success){
	            detailsDiv2.removeChild(p);
	          }
	          });
	        swal("Deleted!", "The org has been deleted from the database.", "success");
	      })
	      p.append(button);
	      detailsDiv2.appendChild(p);

	  });
	  }
	});
}
function fetch_schedules() {
	  fetch('/management/schedules').then((result) => result.json()).then((res) => {
	    //console.log(res);
	    for(let key in res){
	      let p = document.createElement('div');
	      p.innerHTML = "Name:"+res[key]["name"]+"</br>"+"Work Description:"+res[key]["workDescription"]+"</br>"+"Class:"+res[key]["class"]+"</br>"+"Subject:"+res[key]["subject"]+"Days: "+res[key]["days"]+"</br>";
	      p.innerHTML += "Individuals who have opted for this:- </br><ul>";
	      res[key]["individualsOpted"].forEach((individual) => {
	      	p.innerHTML += "<li>"+individual+"</li>";
	      });
	      p.innerHTML += "</ul>";
	      var button = document.createElement('button');
	      var t = document.createTextNode("Remove schedule");
	      button.appendChild(t);
	      button.setAttribute("style", "background-color: red;border:2px solid black;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;");
	      button.addEventListener("click",function(){
	        fetch('/management/deleteSchedule',{
	          method : "POST",
	          body: JSON.stringify(
	          {
	            name : res[key]["name"],
	          }),
	          headers: {"Content-Type" : "application/json;charset=utf-8"}
	        }).then((result) => result.json()).then((res) => {
	          console.log(res);
	          if(res.success){
	            detailsDiv.removeChild(p);
	          }
	          });
	        swal("Deleted!", "The schedule has been deleted from the database.", "success");
	      })
	      p.append(button);
	      detailsDiv.appendChild(p);
	    }
	    });
}


function show_posts() {
	var persons = document.getElementById("persons");
 	persons.style.display = "block";
	var orgs = document.getElementById("orgs");
	orgs.style.display = "none";
	var schedule = document.getElementById("schedule");
	schedule.style.display = "none";
	var dons = document.getElementById("donations");
	dons.style.display = "none";
	var posts = document.getElementById("posts");
	posts.style.display = "block";
  }

function show_persons() {
  var persons = document.getElementById("persons");
  persons.style.display = "block";
  var orgs = document.getElementById("orgs");
  orgs.style.display = "none";
  var schedule = document.getElementById("schedule");
  schedule.style.display = "none";
  var dons = document.getElementById("donations");
  dons.style.display = "none";
  var posts = document.getElementById("posts");
  posts.style.display = "block";
}

function show_orgs() {
  var persons = document.getElementById("persons");
  persons.style.display = "none";
  var orgs = document.getElementById("orgs");
  orgs.style.display = "block";
  var schedule = document.getElementById("schedule");
  schedule.style.display = "none";
  var dons = document.getElementById("donations");
  dons.style.display = "none";
  var posts = document.getElementById("posts");
  posts.style.display = "block";
}

function show_schedule() {
  var persons = document.getElementById("persons");
  persons.style.display = "none";
  var orgs = document.getElementById("orgs");
  orgs.style.display = "none";
  var schedule = document.getElementById("schedule");
  schedule.style.display = "block";
  var dons = document.getElementById("donations");
  dons.style.display = "none";
  var posts = document.getElementById("posts");
  posts.style.display = "block";
}
function show_donations() {
  var persons = document.getElementById("persons");
  persons.style.display = "none";
  var orgs = document.getElementById("orgs");
  orgs.style.display = "none";
  var schedule = document.getElementById("schedule");
  schedule.style.display = "none";
  var dons = document.getElementById("donations");
  dons.style.display = "block";
  var posts = document.getElementById("posts");
  posts.style.display = "block";
}


function add_user() {		// show add person form
	persondiv=document.getElementById("div_addperson");
	persondiv.style.display="block";
	// alert("potray person add_user");
}


function add_user_post(name_i, email_i, username_i, password_i){			// add person function
    //do same as add_schedule and collect input using form
    console.log(name_i+"___"+email_i+"___"+username_i+"___"+password_i)
    fetch('/management/addUser/person',{
    method : "POST",
    body: JSON.stringify(
    {
      name : name_i,
      email : email_i,
      username : username_i,
      password: password_i,
    }),
    headers: {"Content-Type" : "application/json;charset=utf-8"}
  }).then((result) => result.json()).then((res) => {
    console.log(res);
    // displayvoid_persons();
    fetch_persons();
    show_persons();  // ajax call to reload page not working
    // window.location="http://localhost:8080/management"
    });
  swal("Added!", "The person has been added to the database", "success");
}


function submit_person_add() {
	firstname=document.getElementById("fn").value;
	email=document.getElementById("em").value;
	username=document.getElementById("un").value;
	password=document.getElementById("pw").value;

	add_user_post(firstname, email, username, password);
	return false;


}

function add_org(){		// show add org form
    //do same as add_schedule and collect input using form
	orgdiv=document.getElementById("div_addorg");
	orgdiv.style.display="block";
	// alert("potray person add_user");
}


function add_org_post(name_i, email_i, username_i, password_i, persons_i){			// add org function
    //do same as add_schedule and collect input using form
    console.log(name_i+"___"+email_i+"___"+username_i+"___"+password_i)
    fetch('/management/addUser/org',{
    method : "POST",
    body: JSON.stringify(
    {
      name : name_i,
      email : email_i,
      username : username_i,
      password: password_i,
      persons: persons_i,
    }),
    headers: {"Content-Type" : "application/json;charset=utf-8"}
  }).then((result) => result.json()).then((res) => {
    console.log(res);
    // displayvoid_persons();
    fetch_orgs();
    show_orgs();  // ajax call to reload page not working
    // window.location="http://localhost:8080/management"
    });
  swal("Added!", "The org has been added to the database", "success");
}

function submit_org_add() {
	firstname=document.getElementById("t_fn").value;
	email=document.getElementById("t_em").value;
	username=document.getElementById("t_un").value;
	password=document.getElementById("t_pw").value;
	personSelect=document.getElementById("t_persons").options;
	persons = [];
	for(let i = 0; i < personSelect.length; i++){
		if(personSelect[i].selected) persons.push(personSelect[i].value);		
	}

	console.log(persons);
	add_org_post(firstname, email, username, password, persons);
	return false;

}

function add_schedule(){		// show add schedule form
    //do same as add_schedule and collect input using form
	schedulediv=document.getElementById("div_addschedule");
	schedulediv.style.display="block";
	// alert("potray person add_user");
}


function add_schedule_post(name_i, workDescription_i, class_i, subject_i, days_i){
  fetch('/management/addSchedule',{
    method : "POST",
    body: JSON.stringify(
    {
      name : name_i,
      workDescription : workDescription_i,
      class : class_i,
      subject: subject_i,
      days: days_i
    }),
    headers: {"Content-Type" : "application/json;charset=utf-8"}
  }).then((result) => result.json()).then((res) => {
    console.log(res);
    fetch_schedules();
    show_schedule();  // ajax call to reload page not working
    });
  swal("Added!", "The schedule has been added to the database", "success");
}


function submit_schedule_add() {
	firstname=document.getElementById("s_fn").value;
	workDescription=document.getElementById("s_work").value;
	grade=document.getElementById("s_class").value;
	subject=document.getElementById("s_sub").value;
	days = document.getElementById('s_days').value;

	add_schedule_post(firstname, workDescription, grade, subject, days);
	return false;

}
