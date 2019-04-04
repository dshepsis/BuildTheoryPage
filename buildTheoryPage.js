function datePartsToStr(ymdArr) {
    /* The Date constructor treats month as 0-based: */
    const date = new Date(ymdArr[0], ymdArr[1] - 1, ymdArr[2]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

async function buildTheoryPage(doiStr, ele) {
    const response = await fetch('https://api.crossref.org/works/' + doiStr);
    let json;
    try {
        json = (await response.json()).message;
    }
    catch {
        ele.innerHTML = "FAILED"
        return;
    }
    ele.innerHTML = (`
<h1>New Publication Title</h1>
<p>${json.title.join('<br/>Alternate Title: ') || 'MISSING'}</p>
<h1>Authors</h1>
<p>${json.author.map(aobj=>aobj.given+' '+aobj.family).join('<br />') || 'MISSING'}</p>
<h1>Image</h1>
<p>Cannot be automatically filled</p>
<h1>Link to Publication</h1>
<p>${json.link.map(l=>`<a href=${l.URL}>${l.URL}</a>`).join('<br />') || 'MISSING'}</p>
<h1>DOI Number</h1>
<p>${json.DOI || 'MISSING'}</p>
<h1>Journal Title</h1>
<p>${json['container-title'] || 'MISSING'} (Journal Link cannot be automatically filled)</p>
<h1>Publication Year</h1>
<p>Print: ${json['published-print']['date-parts'][0][0] || 'MISSING'}, Online: ${json['published-online']['date-parts'][0][0] || 'MISSING'}</p>
<h1>Journal Volume</h1>
<p>${json.volume || 'MISSING'}</p>
<h1>Page Numbers</h1>
<p>${json.page || 'MISSING'}</p>
<h1>Publication Date</h1>
<p>
    Print: ${datePartsToStr(json['published-print']['date-parts'][0]) || 'MISSING'}
    <br />
    Online: ${datePartsToStr(json['published-online']['date-parts'][0]) || 'MISSING'}
</p>
<h1>Research Area</h1>
<p>Cannot be autuomaticall filled</p>
<h1>Publication Type</h1>
<p>${json.type || 'MISSING'}</p>
<h1>Journal Title Abbr</h1>
<p>${json['short-container-title'] || 'MISSING'}</p>
    `)
}