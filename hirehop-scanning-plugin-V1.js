(function() {
    function initPlugin() {
        // Ensure we are in 'Check Job Out' mode
        let checkJobOutText = document.querySelector("a[href*='check_job_out']");
        if (!checkJobOutText) return; // Exit if not in 'Check Job Out' mode

        // Ensure the Tree View is selected
        setTreeViewDefault();

        // Monitor the 'Hide completed items' checkbox
        let hideCompletedCheckbox = document.querySelector("input[type='checkbox'][name='hide_completed']");
        if (hideCompletedCheckbox) {
            hideCompletedCheckbox.addEventListener("change", hideCompletedItems);
        }

        // Run the hiding function initially in case the checkbox is already checked
        hideCompletedItems();
    }

   function setTreeViewDefault() {
    console.log("Waiting for Tree View button...");

    let checkExist = setInterval(() => {
        let treeViewButton = document.querySelector("a[href*='tree']");
        
        if (treeViewButton && !treeViewButton.classList.contains("active")) {
            console.log("Activating Tree View...");
            treeViewButton.click();
            clearInterval(checkExist); // Stop checking once activated
        }
    }, 1000); // Check every 1 second

    // Stop checking after 15 seconds to prevent infinite loops
    setTimeout(() => clearInterval(checkExist), 15000);
}



    function hideCompletedItems() {
        let hideCompletedCheckbox = document.querySelector("input[type='checkbox'][name='hide_completed']");
        if (!hideCompletedCheckbox || !hideCompletedCheckbox.checked) return;

        let items = document.querySelectorAll(".hirehop-item-row"); // Adjust the selector if needed
        items.forEach(item => {
            let checkedOut = parseInt(item.querySelector(".checked").textContent || "0");
            let required = parseInt(item.querySelector(".qty").textContent || "0");

            // Find auto pull items (sub-items)
            let subItems = item.querySelectorAll(".autopull");
            let allSubItemsCheckedOut = [...subItems].every(sub => {
                let subCheckedOut = parseInt(sub.querySelector(".checked").textContent || "0");
                let subRequired = parseInt(sub.querySelector(".qty").textContent || "0");
                return subCheckedOut >= subRequired;
            });

            // Hide the item if both the main item and its autopull items are fully checked out
            if (checkedOut >= required && allSubItemsCheckedOut) {
                item.style.display = "none";
            }
        });
    }

    // Run the plugin when the page loads
    document.addEventListener("DOMContentLoaded", initPlugin);
})();
