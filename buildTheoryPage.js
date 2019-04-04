function datePartsToStr(ymdArr) {
    /* The Date constructor treats month as 0-based: */
    const date = new Date(ymdArr[0], ymdArr[1] - 1, ymdArr[2]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}
function sdot(obj, path, cb, defaultVal) {
    for (const property of path.split('.')) {
        if (property in obj) obj = obj[property];
        else return defaultVal;
    }
    return (cb === null) ? obj : cb(obj);
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
<p>${sdot(json, 'title', t=>t.join('<br/>Alternate Title: '), 'MISSING')}</p>
<h1>Authors</h1>
<p>${sdot(json, 'author', a=>a.map(aobj=>aobj.given+' '+aobj.family).join('<br />'), 'MISSING')}</p>
<h1>Image</h1>
<p>Cannot be automatically filled</p>
<h1>Link to Publication</h1>
<p>${sdot(json, 'link', ls=>ls.map(l=>`<a href=${l.URL}>${l.URL}</a>`).join('<br />'), 'MISSING')}</p>
<h1>DOI Number</h1>
<p>${sdot(json, 'DOI', null, 'MISSING')}</p>
<h1>Journal Title</h1>
<p>${sdot(json, 'container-title', null, 'MISSING')} (Journal Link cannot be automatically filled)</p>
<h1>Publication Year</h1>
<p>Print: ${sdot(json, 'published-print.date-parts.0.0', null, 'MISSING')}, Online: ${sdot(json, 'published-online.date-parts.0.0', null, 'MISSING')}</p>
<h1>Journal Volume</h1>
<p>${sdot(json, 'volume', null, 'MISSING')}</p>
<h1>Page Numbers</h1>
<p>${sdot(json, 'page', null, 'MISSING')}</p>
<h1>Abstract</h1>
<p>Cannot be automatically filled</p>
<h1>Publication Date</h1>
<p>
    Print: ${sdot(json, 'published-print.date-parts.0', datePartsToStr, 'MISSING')}
    <br />
    Online: ${sdot(json, 'published-online.date-parts.0', datePartsToStr, 'MISSING')}
</p>
<h1>Research Area</h1>
<p>Cannot be automatically filled</p>
<h1>Publication Type</h1>
<p>${sdot(json, 'type', null, 'MISSING')}</p>
<h1>Journal Title Abbr</h1>
<p>${sdot(json, 'short-container-title', null, 'MISSING')}</p>
    `)
}