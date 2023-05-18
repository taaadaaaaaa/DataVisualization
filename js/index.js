// Show image of 2021 and hide 2019, Both chart
function showCanada()
{
    document.getElementById('chart1CanadaTitle').style.display = "block";
    document.getElementById('chart1-container-canada').style.display = "block";
    document.getElementById('chart1-container-australia').style.display = "none";
    document.getElementById('chart1AustraliaTitle').style.display = "none";
}

// Show image of 2019 and hide Both, 2021 chart
function showAustralia()
{
    document.getElementById('chart1-container-australia').style.display = "block";
    document.getElementById('chart1AustraliaTitle').style.display = "block";
    document.getElementById('chart1-container-canada').style.display = "none";
    document.getElementById('chart1CanadaTitle').style.display = "none";
}