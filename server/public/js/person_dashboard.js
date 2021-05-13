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

  fetch('/person/details').then((result) => result.json()).then((res) => {
    console.log(res);
    if(res.success){
      let detailsDiv = document.getElementById('detailsDiv');
      for(let key in res){
        if (key == "success") continue;
        let p = document.createElement('p');
        p.innerHTML = key.charAt(0).toUpperCase() + key.slice(1) + ": " + res[key];
        detailsDiv.appendChild(p);
      }
    }
  });

  fetch('/person/videos').then((result) => result.json()).then((res) => {
    console.log(res);
    let videosArticle = document.getElementById('videos');
    if(res.success){
      let vids = res.videos;
      for(let i = 0; i < vids.length; i++){
        let div = document.createElement("div");
        let h3 = document.createElement("h3");
        h3.innerHTML = "Requested-By : " + vids[i].author + "<br>";
        h3.innerHTML += vids[i].name + "<span class='entypo-down-open'></span><br>";
        div.appendChild(h3);
        let iframe = document.createElement('iframe');
        iframe.setAttribute('width', '640');
        iframe.setAttribute('height', '480');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', vids[i].link);
        div.appendChild(iframe);
        let a = document.createElement('a');
        a.setAttribute('href', '/person/video/' + encodeURIComponent(vids[i].link));
        a.innerHTML = 'Open this video with discussions';
        div.appendChild(a);
        let donateBtn = document.createElement("button");
        donateBtn.id = "donateBtn";
        donateBtn.className = "donateBtn";
        donateBtn.innerHTML="DONATE";
        donateBtn.addEventListener('click',click_donate,false);
        div.appendChild(donateBtn);
        videosArticle.appendChild(div);
      }
    }
    else {
      videosArticle.innerHTML += "<div><h3>No posts to show</h3></div>";
    }
  });

  fetch('/person/myvideos').then((result) => result.json()).then((res) => {
    console.log(res);
    let videosArticle = document.getElementById('myvideos');
    if(res.success){
      let vids = res.videos;
      console.log('Videos', vids);
      for(let i = 0; i < vids.length; i++){
        let div = document.createElement("div");
        let h3 = document.createElement("h3");
        h3.innerHTML = vids[i].name + "<span class='entypo-down-open'></span>";
        div.appendChild(h3);
        let iframe = document.createElement('iframe');
        iframe.setAttribute('width', '640');
        iframe.setAttribute('height', '480');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', vids[i].link);
        div.appendChild(iframe);
        let a = document.createElement('a');
        a.setAttribute('href', '/person/myvideo/' + encodeURIComponent(vids[i].link));
        a.innerHTML = 'Open this video with discussions';
        div.appendChild(a);
        let delBtn = document.createElement("button");
        delBtn.id = "delVideo";
        delBtn.className = "delbtn";
        delBtn.innerHTML="DELETE VIDEO";
        delBtn.addEventListener('click',delete_video,false);
        div.appendChild(delBtn);
        videosArticle.appendChild(div);
      }
    }
    else {
      videosArticle.innerHTML += "<div><h3>No posts to show</h3></div>";
    }
  });

let addVideoBtn = document.getElementById('addVideo');
addVideoBtn.addEventListener('click', submit_video, false);

let delVideoBtn = document.getElementById('delVideo');
delVideoBtn.addEventListener('click',delete_video,false);
});
function submit_video()
{
  fetch('/person/addVideo',{
    method : "POST",
    body: JSON.stringify(
    {
      name : document.getElementById('video_name').value,
      link : document.getElementById('video_url').value
    }),
    headers: {"Content-Type" : "application/json;charset=utf-8"}
  }).then((result) => result.json()).then((res) => {
    console.log(res);
    if(res.success)
    {
  
      let videosArticle = document.getElementById('videos');
      console.log(videosArticle);
      let div = document.createElement("div");
      let h3 = document.createElement("h3");
      h3.innerHTML = res.name+ "<span class='entypo-down-open'></span>";
      div.appendChild(h3);
      let iframe = document.createElement('iframe');
      iframe.setAttribute('width', '640');
      iframe.setAttribute('height', '480');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('src', res.link);
      div.appendChild(iframe);
      let delBtn = document.createElement("button");
      delBtn.id = "delVideo";
      delBtn.className = "delbtn";
      delBtn.innerHTML="DELETE VIDEO";
      delBtn.addEventListener('click',delete_video,false);
      div.appendChild(delBtn);
      videosArticle.appendChild(div);
      swal("Added!", res.name+" has been successfully added.", "success");
    }
    else {
      videosArticle.innerHTML += "<div><h3>No videos to show</h3></div>";
      swal("Failed!", "The video couldn't be added, kindly contact management.", "error");
    }
  });
}

function delete_video(e)
{
  fetch('/person/deleteVideo',{

    method : "POST",
    body : JSON.stringify(
    {
      link : e.target.previousElementSibling.src
    }),
   headers: {"Content-Type" : "application/json;charset=utf-8"}
  }).then((result) => result.json()).then((res) => {
    console.log(res);
    if(res.success) {
      let divToDel = e.target.parentElement;
      divToDel.parentElement.removeChild(divToDel);
      swal("Deleted!", "Video deleted successfully", "success");
    } else {
      swal("Failed!", "Video could not be deleted, contact management", "error");
    }
  });
}

function click_donate(e){
  window.location.href = "/donation"
}

function add_videos() {
  var videos = document.getElementById("addVideos");
  videos.style.display = "block";
  var myvideos = document.getElementById("myvideos");
  myvideos.style.display = "none";
  var vids = document.getElementById("videos");
  vids.style.display = "none";
  var profile = document.getElementById("profile");
  profile.style.display = "none";
}

function show_assignments() {
  var myvideos = document.getElementById("myvideos");
  myvideos.style.display = "none";
  var videos = document.getElementById("addVideos");
  videos.style.display = "none";
  var vids = document.getElementById("videos");
  vids.style.display = "none";
  var profile = document.getElementById("profile");
  profile.style.display = "none";
}

function show_videos() {
  var myvideos = document.getElementById("myvideos");
  myvideos.style.display = "none"; 

  var videos = document.getElementById("addVideos");
  videos.style.display = "none";
  var vids = document.getElementById("videos");
  vids.style.display = "block";
  var profile = document.getElementById("profile");
  profile.style.display = "none";
}
function show_myvideos() {
  var myvideos = document.getElementById("myvideos");
  myvideos.style.display = "block";

  var videos = document.getElementById("addVideos");
  videos.style.display = "none";
  var vids = document.getElementById("videos");
  vids.style.display = "none";
  var profile = document.getElementById("profile");
  profile.style.display = "none";
}

function show_profile() {
  var myvideos = document.getElementById("myvideos");
  myvideos.style.display = "none";
  var videos = document.getElementById("addVideos");
  videos.style.display = "none";
  var vids = document.getElementById("videos");
  vids.style.display = "none";
  var profile = document.getElementById("profile");
  profile.style.display = "block";
}

