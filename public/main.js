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

      fetch("/delete-answer", {
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

