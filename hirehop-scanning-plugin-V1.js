(function() {
    console.log("Plugin is working! 🚀");

    function initPlugin() {
        console.log("Plugin Initialized!");

        // Ensure we are in 'Check Job Out' mode
        let checkJobOutText = document.querySelector("a[href*='check_job_out']");
        console.log("Check Job Out mode found:", checkJobOutText);
        if (!checkJobOutText) return;

        // Ensure the Tree View is selected
        setTreeViewDefault();

        // Monitor the 'Hide completed items' checkbox
        let hideCompletedCheckbox = document.querySelector("input[type='checkbox'][name='hide_completed']");
        console.log("Hide completed checkbox found:", hideCompletedCheckbox);
        if (hideCompletedCheckbox) {
            hideCompletedCheckbox.addEventListener("change", hideCompletedItems);
        }

        // Run the hiding function initially in case the checkbox is already checked
        hideCompletedItems();
    }

    // ✅ Properly Define the Function and Expose it Globally
    window.setTreeViewDefault = function() {
        console.log("Waiting for Tree View button...");

        let checkExist = setInterval(() => {
            let treeViewButton = document.querySelector("a[href*='tree']");
            console.log("Tree View button found:", treeViewButton);

            if (treeViewButton && !treeViewButton.classList.contains("active")) {
                console.log("Activating Tree View...");
                treeViewButton.click();
                clearInterval(checkExist); // Stop checking once activated
            }
        }, 1000); // Check every 1 second

        // Stop checking after 15 seconds to prevent infinite loops
        setTimeout(() => clearInterval(checkExist), 15000);
    };

    function hideCompletedItems() {
        console.log("Checking for completed items...");

        let hideCompletedCheckbox = document.querySelector("input[type='checkbox'][name='hide_completed']");
        console.log("Hide completed checkbox checked:", hideCompletedCheckbox && hideCompletedCheckbox.checked);
        if (!hideCompletedCheckbox || !hideCompletedCheckbox.checked) return;

        let items = document.querySelectorAll(".hirehop-item-row");
        console.log("Items to hide:", items.length);

        items.forEach(item => {
            let checkedOut = parseInt(item.querySelector(".checked").textContent || "0");
            let required = parseInt(item.querySelector(".qty").textContent || "0");

            let subItems = item.querySelectorAll(".autopull");
            let allSubItemsCheckedOut = [...subItems].every(sub => {
                let subCheckedOut = parseInt(sub.querySelector(".checked").textContent || "0");
                let subRequired = parseInt(sub.querySelector(".qty").textContent || "0");
                return subCheckedOut >= subRequired;
            });

            if (checkedOut >= required && allSubItemsCheckedOut) {
                console.log("Hiding completed item:", item);
                item.style.display = "none";
            }
        });
    }

    // Run the plugin when the page loads
    document.addEventListener("DOMContentLoaded", initPlugin);
})();
