let blankChapter = {
	type: "full",
	colors: {
		headBorder: "F3F3F2",
		gradientStart: "FFFFFF",
		gradientend: "F6F6F5",
		titleColor: "C9C9C9",
		quoteColor: "00B1FF",
		iconBorder: "71E874",
		pageBorder: "71E874",
	},
	text: {
		title: "",
		quote: "",
		url: "/"
	},
	images: {
		imageUrl: "",
		noteUrl: ""
	},
	pages: []
}

let blankPage = {
	url: "/",
	imageUrl: ""
}

let blankSection = {
	color: "71E874",
	startChapter: 1,
	endChapter: 1,
	position: 2,
	name: "",
	number: "",
	iconUrl: ""
}

let exampleMap = {"chapterList":[{"type":"full","colors":{"headBorder":"302418","gradientStart":"c77d3c","gradientend":"fcb473","titleColor":"755732","quoteColor":"302418","iconBorder":"302418","pageBorder":"302418"},"text":{"title":"Prologue","quote":"The young man calls it good enough.","url":"https://mspfa.com/?s=46034&p=1"},"images":{"imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0001.png","noteUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/utyippee"},"pages":[{"url":"https://mspfa.com/?s=46034&p=4","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0004.png"},{"url":"https://mspfa.com/?s=46034&p=6","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0006.png"},{"url":"https://mspfa.com/?s=46034&p=8","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0008.png"},{"url":"https://mspfa.com/?s=46034&p=11","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0011.png"},{"url":"https://mspfa.com/?s=46034&p=14","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0014.png"}]},{"type":"full","colors":{"headBorder":"292522","gradientStart":"9f3629","gradientend":"b34842","titleColor":"56192b","quoteColor":"292522","iconBorder":"302418","pageBorder":"302418"},"text":{"title":"Chapter 1","quote":"This adventure never made it past chapter 1","url":"https://mspfa.com/?s=46034&p=19"},"images":{"imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0019.png","noteUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/flippy.png"},"pages":[{"url":"https://mspfa.com/?s=46034&p=21","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0021.png"},{"url":"https://mspfa.com/?s=46034&p=23","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0023.png"},{"url":"https://mspfa.com/?s=46034&p=24","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0024.png"},{"url":"https://mspfa.com/?s=46034&p=27","imageUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/NoParadox/0027.png"}]}],"sectionList":[{"color":"3a6919","startChapter":"1","endChapter":"1","position":"2","name":"Sect","number":"1","iconUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/MSPFA%20other/PS%20Theme/pointer.gif"},{"color":"577b3c","startChapter":"2","endChapter":"2","position":"2","name":"sect","number":"2","iconUrl":"https://file.garden/X1htvgJ0DEp_tp-Z/MSPFA%20other/PS%20Theme/pointer.gif"},{"color":"612318","startChapter":"1","endChapter":"2","position":"4","name":"adventure","number":"A","iconUrl":""}]}

let currentMap = exampleMap

const validateColor = color => /^(?:[0-9a-fA-F]{3}){1,2}$/g.test(color.replace(/#/g, "")) ? "#" + color.replace(/#/g, "") : color

const chapterObjectToHTML = (chapter, row) =>  `
<div class="chapter ${chapter.type == "intermission" ? "intermission" : "full"}" id="chapter${row}" style="--row: ${row}; --headBorder: ${validateColor(chapter.colors.headBorder)}; --gradientStart: ${validateColor(chapter.colors.gradientStart)}; --gradientend: ${validateColor(chapter.colors.gradientend)}; --iconBorder: ${validateColor(chapter.colors.iconBorder)}; --pageBorder: ${validateColor(chapter.colors.pageBorder)}; --titleColor: ${validateColor(chapter.colors.titleColor)}; --quoteColor: ${validateColor(chapter.colors.quoteColor)};">
	<div class="chapterHead">
		<a class="chapterStartLink" href="${chapter.text.url}"></a>
		<img class="chapterImage" src="${chapter.images.imageUrl}">
		<div class="chapterDesc">
			<h2 class="chapterTitle">${chapter.text.title}</h2>
			<div class="chapterQuote">“${chapter.text.quote}”</div>
			${chapter.type == "intermission" ? "" : `<img class="chapterNote" src="${chapter.images.noteUrl}">`}
		</div>
	</div>
	<div class="chapterPageList">
		${chapter.pages.map(page => `<a class="chapterPage" href="${page.url}"><img src="${page.imageUrl}"></a>`).join("")}
	</div>
</div>`

const sectionObjectToHTML = section => `
<div class="section ${section.position < 3 ? "left" : "right"}" style=" --sectionColor: ${validateColor(section.color)}; --startChapter: ${section.startChapter}; --endChapter: ${section.endChapter}; --column: ${section.position};">
	<div class="sectionLabel">
		<div class="sectionName">
			${section.name.split("").join("<br>")} <div class="sectionChar">${section.number}</div>
		</div>
		<img src="${section.iconUrl}" class="sectionIcon">
	</div>
	<div class="sectionSection"></div>
</div>`

const chapterObjectToDivider = (chapter, row) => `
<div class="divider" style="--row: ${row}">
	<img src="${chapter.images.imageUrl}">
</div>`

// Save editor
let pageEditor = document.querySelector(".pageEditor").cloneNode(true)
let chapterEditor = document.querySelector(".chapterEditor").cloneNode(true)
let chapterList = document.getElementById("chapterList")
let sectionEditor = document.querySelector(".sectionEditor").cloneNode(true)
let sectionList = document.getElementById("sectionList")

let generatePreview = mapObject => {
	let finalHTML = ""
	mapObject.chapterList.forEach((chapter, i) => {
		if (chapter.type == "divider") {
			finalHTML += chapterObjectToDivider(chapter, i + 1)
		} else {
			finalHTML += chapterObjectToHTML(chapter, i + 1)
		}
	});
	mapObject.sectionList.forEach(section => {
		finalHTML += sectionObjectToHTML(section)
	})
	return finalHTML
}

let setInputValue = (editor, valueName, value) => {
	editor.querySelector(`input[name=${valueName}]`).value = value
}

let getInputValue = (editor, valueName) => editor.querySelector(`input[name=${valueName}]`).value

let generateEditor = mapObject => {
	// Chapters
	chapterList.innerHTML = "";
	mapObject.chapterList.forEach((chapter, i) => {
		let newChapterEditor = chapterEditor.cloneNode(true)
		newChapterEditor.id = "chp" + (i + 1)

		// Set type
		if (chapter.type == "intermission") {
			newChapterEditor.querySelector(`input[name=intermission]`).checked = true
		}
		if (chapter.type == "divider") {
			newChapterEditor.setAttribute("divider", "true")
		}
		// Set Colors
		setInputValue(newChapterEditor, "headBorder", chapter.colors.headBorder)
		setInputValue(newChapterEditor, "gradientStart", chapter.colors.gradientStart)
		setInputValue(newChapterEditor, "gradientend", chapter.colors.gradientend)
		setInputValue(newChapterEditor, "titleColor", chapter.colors.titleColor)
		setInputValue(newChapterEditor, "quoteColor", chapter.colors.quoteColor)
		setInputValue(newChapterEditor, "pageBorder", chapter.colors.pageBorder)
		setInputValue(newChapterEditor, "iconBorder", chapter.colors.iconBorder)

		newChapterEditor.style.setProperty("--border", validateColor(chapter.colors.headBorder));
		newChapterEditor.style.setProperty("--gradientStart", validateColor(chapter.colors.gradientStart));
		newChapterEditor.style.setProperty("--gradientend", validateColor(chapter.colors.gradientend));
		newChapterEditor.style.setProperty("--quoteColor", validateColor(chapter.colors.quoteColor));
		newChapterEditor.style.setProperty("--pageBorder", validateColor(chapter.colors.pageBorder));
		// Set Text
		setInputValue(newChapterEditor, "title", chapter.text.title)
		setInputValue(newChapterEditor, "quote", chapter.text.quote)
		setInputValue(newChapterEditor, "url", chapter.text.url)
		// Set Images
		setInputValue(newChapterEditor, "imageUrl", chapter.images.imageUrl)
		setInputValue(newChapterEditor, "noteUrl", chapter.images.noteUrl)

		// Set pages
		newChapterEditor.querySelector(".pageList").innerHTML = ""
		chapter.pages.forEach(page => {
			let newPageEditor = pageEditor.cloneNode(true)
			setInputValue(newPageEditor, "pagelinkURL", page.url)
			setInputValue(newPageEditor, "pageimgURL", page.imageUrl)
			newChapterEditor.querySelector(".pageList").appendChild(newPageEditor)
		})

		// Set button onclicks
		newChapterEditor.querySelector(".addPageBtn").onclick = () => {
			currentMap.chapterList[i].pages.push(structuredClone(blankPage))
			updateGUI()
		}
		newChapterEditor.querySelector(".removePageBtn").onclick = () => {
			currentMap.chapterList[i].pages.pop()
			updateGUI()
		}

		newChapterEditor.querySelector(".deleteBtn").onclick = () => {
			currentMap.chapterList.splice(i, 1)
			updateGUI()
		}
		newChapterEditor.querySelector(".moveUpBtn").onclick = () => {
			[currentMap.chapterList[i], currentMap.chapterList[i - 1]] = [currentMap.chapterList[i - 1], currentMap.chapterList[i]]
			updateGUI()
		}
		newChapterEditor.querySelector(".moveDownBtn").onclick = () => {
			[currentMap.chapterList[i], currentMap.chapterList[i + 1]] = [currentMap.chapterList[i + 1], currentMap.chapterList[i]]
			updateGUI()
		}
		newChapterEditor.querySelector(".dividerBtn").onclick = () => {
			currentMap.chapterList[i].type = currentMap.chapterList[i].type == "divider" ? "full" : "divider"
			updateGUI()
		}

		// Set up inputs
		newChapterEditor.querySelectorAll("input").forEach(el => {
			el.onchange = () => { generateMapObject() }
		})

		chapterList.appendChild(newChapterEditor)
	});

	// Sections
	sectionList.innerHTML = "";
	mapObject.sectionList.forEach((section, i) => {
		let newSectionEditor = sectionEditor.cloneNode(true)
		newSectionEditor.id = "sec" + i

		// Normal values
		setInputValue(newSectionEditor, "color", section.color)
		setInputValue(newSectionEditor, "startChapter", section.startChapter)
		setInputValue(newSectionEditor, "endChapter", section.endChapter)
		setInputValue(newSectionEditor, "name", section.name)
		setInputValue(newSectionEditor, "number", section.number)
		setInputValue(newSectionEditor, "iconUrl", section.iconUrl)

		newSectionEditor.style.setProperty("--gradientStart", validateColor(section.color));
		newSectionEditor.style.setProperty("--gradientend", validateColor(section.color));

		// Position value
		newSectionEditor.querySelector(`select`).value = section.position

		// On click functions

		newSectionEditor.querySelector(".deleteBtn").onclick = () => {
			currentMap.sectionList.splice(i, 1)
			updateGUI()
		}
		newSectionEditor.querySelector(".moveUpBtn").onclick = () => {
			[currentMap.sectionList[i], currentMap.sectionList[i - 1]] = [currentMap.sectionList[i - 1], currentMap.sectionList[i]]
			updateGUI()
		}
		newSectionEditor.querySelector(".moveDownBtn").onclick = () => {
			[currentMap.sectionList[i], currentMap.sectionList[i + 1]] = [currentMap.sectionList[i + 1], currentMap.sectionList[i]]
			updateGUI()
		}

		newSectionEditor.querySelectorAll("input, select").forEach(el => {
			el.onchange = () => { generateMapObject() }
		})


		sectionList.appendChild(newSectionEditor)
	})

}

let generateMapObject = () => {
	let newMapObject = {
		chapterList: [],
		sectionList: []
	}

	chapterList.querySelectorAll(".chapterEditor").forEach(editor => {
		let newChapter = structuredClone(blankChapter)

		// Get type
		if (editor.getAttribute("divider") == "true") {
			newChapter.type = "divider"
		} else if (editor.querySelector(`input[name=intermission]`).checked) {
			newChapter.type = "intermission"
		}

		// Get colors
		newChapter.colors.headBorder = getInputValue(editor, "headBorder")
		newChapter.colors.gradientStart = getInputValue(editor, "gradientStart")
		newChapter.colors.gradientend = getInputValue(editor, "gradientend")
		newChapter.colors.titleColor = getInputValue(editor, "titleColor")
		newChapter.colors.quoteColor = getInputValue(editor, "quoteColor")
		newChapter.colors.pageBorder = getInputValue(editor, "pageBorder")
		newChapter.colors.iconBorder = getInputValue(editor, "iconBorder")
		// Get text
		newChapter.text.title = getInputValue(editor, "title")
		newChapter.text.quote = getInputValue(editor, "quote")
		newChapter.text.url = getInputValue(editor, "url")
		// Get images
		newChapter.images.imageUrl = getInputValue(editor, "imageUrl")
		newChapter.images.noteUrl = getInputValue(editor, "noteUrl")
		// Get pages
		editor.querySelectorAll(".pageEditor").forEach(page => {
			let newPage = structuredClone(blankPage)
			newPage.url = getInputValue(page, "pagelinkURL")
			newPage.imageUrl = getInputValue(page, "pageimgURL")
			newChapter.pages.push(newPage)
		})

		newMapObject.chapterList.push(newChapter)
	})

	sectionList.querySelectorAll(".sectionEditor").forEach(editor => {
		let newSection = structuredClone(blankSection)

		newSection.name = getInputValue(editor, "name")
		newSection.number = getInputValue(editor, "number")
		newSection.color = getInputValue(editor, "color")
		newSection.iconUrl = getInputValue(editor, "iconUrl")
		newSection.startChapter = getInputValue(editor, "startChapter")
		newSection.endChapter = getInputValue(editor, "endChapter")
		newSection.position = editor.querySelector(`select`).value

		newMapObject.sectionList.push(newSection)
	})

	console.log(newMapObject)
	currentMap = newMapObject
	updateGUI()
}

let updateGUI = () => {
	// Load HTML into preview
	let mapHTML = generatePreview(currentMap)
	document.querySelectorAll("#adventureMap").forEach(el => {
		el.innerHTML = mapHTML
	})

	document.querySelectorAll("#windowScroll .chapter").forEach(chapter => {
		chapter.querySelector("a").href = "#" + chapter.id.replace("chapter", "chp")
	})

	// Save Adventure MAP to html
	generateEditor(currentMap)
	document.getElementById("exportTextarea").textContent = JSON.stringify(currentMap)
	localStorage.setItem("currentMap", JSON.stringify(currentMap));

	// Export HTML with overhead to output
	document.getElementById("htmlOutput").textContent = document.getElementById("preview").innerHTML.replace(/\n\s*/g, "")
}

let importMap = () => {
	if (document.getElementById("importTextarea").value) {
		currentMap = JSON.parse(document.getElementById("importTextarea").value)
		updateGUI()
	}
}

let clearMapObject = () => {
	currentMap = {
		chapterList: [ structuredClone(blankChapter) ],
		sectionList: [ structuredClone(blankSection) ]
	}
	updateGUI()
}

let addChapter = () => {
	currentMap.chapterList.push(structuredClone(blankChapter))
	updateGUI()
}

let addSection = () => {
	currentMap.sectionList.push(structuredClone(blankSection))
	updateGUI()
}

let toggleMiniPreview = () => {
	let miniPreview = document.getElementById("miniPreviewWindow")
	document.body.classList = document.body.classList == "previewClose" ? "previewOpen" : "previewClose"
}

currentMap = JSON.parse(localStorage.getItem("currentMap")) ?? exampleMap
updateGUI()