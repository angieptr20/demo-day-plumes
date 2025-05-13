      //    WORKING ONE

document.querySelectorAll(".fa-star").forEach(star => {
  star.addEventListener("click", function () {

    const title = this.parentNode.parentNode.childNodes[1].innerText

    console.log(title)
      fetch("/update-favorite", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            'title' : title, 
          })
      })
      // .then(response => response.json())
      // .then(() => {
      //   window.location.reload(true);
      // });
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

document.querySelectorAll(".fa-trash").forEach(trash => {
  trash.addEventListener("click", function () {

      const title = this.parentNode.parentNode.childNodes[1].innerText;

      fetch("/delete-song", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title })
      })
      // .then(response => response.json())
      // .then(() => {
      //     window.location.reload(); // Refresh to ensure song is deleted
      // });
         .then(function (response) {
          window.location.reload()
        })
  });
});

                  //RECORDINGS
document.querySelectorAll(".star2").forEach(star => {
  star.addEventListener("click", function () {

    const title = this.parentNode.parentNode.children[0].innerText;

    console.log(title)
      fetch("/update-favorite-recording", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            'title' : title, 
          })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

document.querySelectorAll(".trash2").forEach(trash => {
  trash.addEventListener("click", function () {

      const title = this.parentNode.parentNode.childNodes[1].innerText;

      fetch("/delete-recording", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title })
      })
      .then(function (response) {
          window.location.reload()
      })
  });
});
    
document.querySelectorAll(".star3").forEach(star => {
  star.addEventListener("click", function () {

    const title = this.parentNode.parentNode.childNodes[1].innerText;

    console.log(title)
      fetch("/update-favorite-artwork", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            'title' : title, 
          })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

document.querySelectorAll(".trash3").forEach(trash => {
  trash.addEventListener("click", function () {

      const title = this.parentNode.parentNode.childNodes[1].innerText;

      fetch("/delete-artwork", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title })
      })
      .then(function (response) {
          window.location.reload()
      })
  });
});