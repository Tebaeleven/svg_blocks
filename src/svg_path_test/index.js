let svg = d3.select("#block-path");

let rightConnect = 1
let leftConnect = 1

function drawBlock(blockWidth, blockHeight, blockRadius) {
    const path = d3.path();

    path.moveTo(5 + blockRadius, 5)
    path.arcTo(5 + blockWidth, 5, 5 + blockWidth, 15, blockRadius)

    if (rightConnect === 1) {
        makeRightConnect(0, 10, 0, path, 1, blockWidth, blockHeight)
    } else {
        makeRightConnect(-5, 10, -15, path, 1, blockWidth, blockHeight)
        makeRightConnect(20, 10, -15, path, 1, blockWidth, blockHeight)
    }

    path.arcTo(blockWidth + 5, blockHeight + 5, blockWidth + 5 - 5, blockHeight + 5, blockRadius)
    path.arcTo(5, blockHeight + 5, 5, blockHeight, blockRadius)

    if (leftConnect === 1) {
        makeLeftConnect(0, 10, 0, path, 1, blockWidth, blockHeight)
    } else {
        makeLeftConnect(20, 10, -15, path, 1, blockWidth, blockHeight)
        makeLeftConnect(-5, 10, -15, path, 1, blockWidth, blockHeight)
    }

    path.arcTo(5, 5, 10, 5, blockRadius)
    path.closePath()

    svg
        .attr("d", path)
        .attr("fill", "#e74c3c")
        .attr("stroke", "red")
        .attr("stroke-width", "4")
}


drawBlock(80, 60, 5)

document.getElementById("block-path").addEventListener("click", function () {
    if (rightConnect === 1) {
        rightConnect = -1
    } else {
        rightConnect = 1
    }
    if (leftConnect === 1) {
        leftConnect = -1
    } else {
        leftConnect = 1
    }
    drawBlock(80, 60, 5)
})

function makeRightConnect(y, width, height, path, type, blockWidth, blockHeight) {

    switch (type) {
        case 1:
            path.lineTo((blockWidth + 5), (blockHeight - 40) + y)
            path.lineTo((blockWidth + 5) + width, (blockHeight - 35) + y)
            path.lineTo((blockWidth + 5) + width, (blockHeight - 15 + height) + y)
            path.lineTo((blockWidth + 5), (blockHeight - 10 + height) + y)
            break;
        default:
            break;
    }
}

function makeLeftConnect(y, width, height, path, type, blockWidth, blockHeight) {
    switch (type) {
        case 1:
            path.lineTo(5, (blockHeight - 10 + height) + y)
            path.lineTo(5 + width, (blockHeight - 15 + height) + y)
            path.lineTo(5 + width, (blockHeight - 35) + y)
            path.lineTo(5, (blockHeight - 40) + y)
            break;
        default:
            break;
    }
}