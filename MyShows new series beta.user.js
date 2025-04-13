// ==UserScript==
// @name         MyShows new series beta (floating panel UI)
// @namespace    https://beta.myshows.me
// @description  Проверка переведённых серий — боковая панель
// @version      0.32.1
// @match        https://myshows.me/*
// @exclude      https://myshows.me/news/*
// @connect      coldfilm.ink
// @connect      baibako.tv
// @connect      myshows.me
// @connect      self
// @author       Black_Sun
// @license      MIT
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

const $j = jQuery.noConflict();
const fullfilm = true;
const domain = "coldfilm.ink";
const ICONS = {
  renewImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFF0lEQVRYhe1W3WsTWRT/3UkszUycRhriQkxcIpWY5qPGRVK/EqqIiuJC90HEDyLiQ9FFpf+AL/rWFRFp6fpQ9cGX1oc+NAjC4roFlV1TCWqXVkNB0agk0SSTycecfagzJGbS+gX74g8Oc+85557fufecexngO/5nMD3lqVOnuOvXr3eJovijzWbjFgpQqVSgKEpTezqdVt6/fz8XCoX+uXHjRoOj8WOFzWb7KZPJjIyOjnoCgQA4bkH+RaEoChKJBC5fvvyvzWaLplKpyVp73Qk4HI4fwuHw46GhIcvXEn8MIsKJEydysVis8/nz53Oqvo4ln8//HI1Gvzk5ADDGcOTIEbMkSb/U6utKQETrvF7vgoFevXqFeDwOs9mMjRs3avqpqSkwxuD3+5uu9Xg8MBqN62p1dVvt6OgIiqKouziRSCAYDMLj8WD//v2Ix+OaTZZlHDt2DD09PTh58iQkSdKN0draijVr1gR1E4hEIi2rVq1quv1ly5aB53kQEYgILpdLsw0PD2NmZgZEhKtXr2Lfvn2QZVk3jsvlWh0IBMzq3KAOJEkK7Nq1q6/2WFW8ePECO3fuxNOnT7Fnzx5s27YNkUgEVqsVALBy5UpkMhkkEgkAwNzcHAqFAnp6ehpiPXv2jMVisYlCoTBXZ7BYLEfHxsZIkqQ6KRQKtH37duJ5nsLhMGWz2QYfVS5dukRms5l4nqelS5fSkydPGnwmJibIYrH82lACRVF0G/D27du4c+cOAKC/vx8tLS26RwsA0WgUBw4cAABUq1WMjo42+Ph8PiiKojWilkB7e3twxYoVDQvGx8fnHTkO69evb0qu4vjx42Bs/nl58OBBg729vR1Op1NrRCMA7Nixw8gY86sLazE9Pa2NTSbTogm4XC5YLBak02lks1ldn46ODo/JZOLv379f4AAgHo973G53q55zuVwGMP+kPnr0aNEEGGNYsmQJAMBms4Ex1iCdnZ1cMpn0Ax9KIMtysNkDZLfbtfHFixcXJX/58iVSqRQAYNOmTbp+Pp8P5XI5qCVQrVbX+Xw+XedwOKyNx8bGMDQ01EDKGEMulwMAXLhwAcD8u9Hb26sb0+v11jUirFbrX82u1+vXr8lutxPP85r09fVRKpWiYrGoSVdXF50+fZoEQSBBEOjatWskyzLJskylUqlOisUi2e32+Q49fPiwsbu7O9/sbkuSRIODg3UJCIJAt27d0sjz+bx2/3mep/Pnz1O5XKZyuUyVSkVXtm7dWt68eXMrd/PmzdVut5tfqLaHDh3CwYMHtfnevXuxYcMGbf7u3bu6n5IrV65gdnYWBoMBHMeB4zgYDIa6udfrNU5PT/uNxWKxaQPW1nlgYABOpxODg4M4c+ZMXVdnMhmYTCasXbsWkUgEkUgETqcTetda1fn9foyMjAQhiuJvsVis6fGroh63Wnu1tpVKhfL5PKXTafoc3L17l0RRHDYSUVdbW9uiJ6BCFEUwxsBxnPbleR48v2AVG9DW1gYi8nNEJE5NTX0SuTpX66gm8SX4wGnhOI57ODAwgLdv334See3uv5Q8m83i3LlzYIw9ZMuXL3fncrm/HQ4H39/fj1AoBJPJtCD5l/4zlkol3Lt3D2fPnsXMzExJEIRuBgBWqzXEcdxILpdbrf7xfEvUboYxBkEQkkQUffPmzR+aZXJysnV8fPxoMpkMV6tVvjYJdfw5iamktV+DwVB0OBx/7t69+/ctW7bkvm5b3/GN8B/LWe5/FfVXFwAAAABJRU5ErkJggg==',
  download: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE3ElEQVRYheWWXWwUVRTH/+fOfky3u9vtB80KLUWoxPSBICY+0ILWWDTGRGKMATGG+GCMWhIMARrSWMIDRiJ9UHkwIZCGEB+MERMJ0fqR+IEaYviIFUqKLS2hBdrO7uzs7szcuceHpduubOlWy4PxJCeZzJz/ub/7v/fODPB/D5qrIHFsX4yAjeSpVmJeCSAEohSE6GfN9y0In0U2dyQXHMDo2RsSzHtIym1CemHiv5czWBDY508iEHyPNfFuZPPu7IIAJHr2NpLjnhC23USgXFmxSp4GgR46z0H92ciLuwb/FYBxtGu5yGZ/JDsbJ4iZIyFvAk8JZ8gJ4FD5CMrCzZEtu67+I4DJI506Ze3TwrJWg24/YgYH/NAaHoRW/wBID4MzKXgjl6GGLgGuW9gwWvkrykLNkZc6ZCkAvgKxK7fBTKxWHufxaHEDyto2Q6upK1SuWgfvxjCyvR9DXb8KgHMWGeOPCM33GoAP5uXAxEcdAaTMYVhmLYHAYIj7GlD+/JsQZeFZG6i0ifQnH0KNTrtOFVUjFK68v+KVzjldEPkrpR7nVLKWHQfKscFE0B97DuQPgqU7a1JAR3D9s2AiKNfOZdKog/JaSnEgvwQqk36UMxagcvZrdcuhLVoCls6cTbT4UlB1HN7gpdwNVwJpswXAdyUDcDa7TNlZgBkgQiDeAPbcu2kLQtTWQ10+n9dTxlpRim4awHVCyrFzG0kQoGmALB0AmoBynNsAADlZfX4AnmfkAHIz8CZuQrlz2z8VcmIMypl2kDxpzAsAJH5XUgIqt3Gd/rPQ1z0NEtqcTdiTsPvP5QAAQPNBEP4oBWD6FGhaLzQNyrGhHBvOyADsCz+DPXfOzJ77Hu71obyWfRpYiC/nBcCedxZ66Cy7Dth1oCwT5hfH4A4PAJ6cNZ2hizBPHgenrZxOOoBe9tPizp6L8wKId/UoKo/s4UAwPxM5NoLJo+/A+uUrqEwK7Ml8emkTqdOnMHn0ALyb1/MaBIJAebizlMGBIh+jofYnjsjhga3sONMVPj9EZTX89SsgyqPwUgnI4QEoYxyQcupbBQSD0JYuP1T1cHM7QKh4uUvNH2DXRl0Zt07Ia4Mb2LFnkfCdt4M6fMsae6sfarkqWG0iCB/8gc8RCL4R3rTzRskAADC485mAMhPdcuza65w08m/HoiEIVFEJLb7kYM2a9XUinX6BZrTl8kgfgnprZMvuohB3/SW7sr1trTImOpWZ2KDMpIB08+ccfj8oElUiGjspYpX7alat74dpjCOTFgUABCAc7WO9rDW29e07IOb8JwSAgR1PxVm6LWxnV0KpCDSRoIDeD7//h8YDp24AQOLIvjo1PjrMlllkmgREY30IhVqrXt1fAFESQCmRONwl5PjYBTUx1gQusmREoFh1H8ojrTXtB/MQCwYAADe729eoW6Nfq8RkrGgBEUR1bR+FK5prdxwygJlvwgWIRdvf/43D0TYVCBjSMiGtZGGmEnBH/mxSycSeKc2CAgBAvOPwGYrG2ljXDS+dgmcVpjQNyMT42nsGAACLu46foVh1G4fChpe14GVSM9KC9JzRewoAAPX7Pz1DVYvaOFJhSDsDmbUg7TRUqEyyrndP1S3oJiwWV956sslLjO9nO7MG/sAVEave29jd+829Hve/E38BEpKdi/gPz0EAAAAASUVORK5CYII=',
  torrent: 'data:image/png;base64,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',
  notfound: 'data:image/png;base64,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',
  loading: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDEyOCAxNiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0iIzk0OTQ5NCIgZD0iTTYuNCw0LjhBMy4yLDMuMiwwLDEsMSwzLjIsOCwzLjIsMy4yLDAsMCwxLDYuNCw0LjhabTEyLjgsMEEzLjIsMy4yLDAsMSwxLDE2LDgsMy4yLDMuMiwwLDAsMSwxOS4yLDQuOFpNMzIsNC44QTMuMiwzLjIsMCwxLDEsMjguOCw4LDMuMiwzLjIsMCwwLDEsMzIsNC44Wm0xMi44LDBBMy4yLDMuMiwwLDEsMSw0MS42LDgsMy4yLDMuMiwwLDAsMSw0NC44LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsNTQuNCw4LDMuMiwzLjIsMCwwLDEsNTcuNiw0LjhabTEyLjgsMEEzLjIsMy4yLDAsMSwxLDY3LjIsOCwzLjIsMy4yLDAsMCwxLDcwLjQsNC44Wm0xMi44LDBBMy4yLDMuMiwwLDEsMSw4MCw4LDMuMiwzLjIsMCwwLDEsODMuMiw0LjhaTTk2LDQuOEEzLjIsMy4yLDAsMSwxLDkyLjgsOCwzLjIsMy4yLDAsMCwxLDk2LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsMTA1LjYsOCwzLjIsMy4yLDAsMCwxLDEwOC44LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsMTE4LjQsOCwzLjIsMy4yLDAsMCwxLDEyMS42LDQuOFoiLz48Zz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNLTQyLjcsMy44NEE0LjE2LDQuMTYsMCwwLDEtMzguNTQsOGE0LjE2LDQuMTYsMCwwLDEtNC4xNiw0LjE2QTQuMTYsNC4xNiwwLDAsMS00Ni44Niw4LDQuMTYsNC4xNiwwLDAsMS00Mi43LDMuODRabTEyLjgtLjY0QTQuOCw0LjgsMCwwLDEtMjUuMSw4YTQuOCw0LjgsMCwwLDEtNC44LDQuOEE0LjgsNC44LDAsMCwxLTM0LjcsOCw0LjgsNC44LDAsMCwxLTI5LjksMy4yWm0xMi44LS42NEE1LjQ0LDUuNDQsMCwwLDEtMTEuNjYsOGE1LjQ0LDUuNDQsMCwwLDEtNS40NCw1LjQ0QTUuNDQsNS40NCwwLDAsMS0yMi41NCw4LDUuNDQsNS40NCwwLDAsMS0xNy4xLDIuNTZaIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIHZhbHVlcz0iMjMgMDszNiAwOzQ5IDA7NjIgMDs3NC41IDA7ODcuNSAwOzEwMCAwOzExMyAwOzEyNS41IDA7MTM4LjUgMDsxNTEuNSAwOzE2NC41IDA7MTc4IDAiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgZHVyPSIxMzAwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9nPjwvc3ZnPgo='
};

const $style = $j(`
    <style>
	 #nameblock{
	  border: 1px solid #bbbbbb;
      border-radius: 5px 5px 0 0;
      background: #039bf31f;
	  border-bottom: 0;
	  display:none;
	  }
	 #hrefblock{
	  border: 1px solid #bbbbbb;
      border-radius: 5px;
      background: #039bf31f;
	  /*border-top: 0;
      margin-top: -2px;*/
	  padding: 5px 0;
	  }
	</style>`);

  $j('body').append($style);

function enableDragging($panel, $handle) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  $handle.css('cursor', 'move');

  $handle.on('mousedown', function (e) {
    const panelOffset = $panel.offset();
    offsetX = e.pageX - panelOffset.left;
    offsetY = e.pageY - panelOffset.top;
    isDragging = true;
    e.preventDefault();
  });

  $j(document).on('mousemove.dragpanel', function (e) {
    if (isDragging) {
      const newLeft = e.pageX - offsetX;
      const newTop = e.pageY - offsetY;
      $panel.css({ left: newLeft + 'px', top: newTop + 'px', right: 'auto' });
    }
  });

  $j(document).on('mouseup.dragpanel', function () {
    if (isDragging) {
      isDragging = false;
      const pos = $panel.offset();
      GM_setValue('floatingPanelPos', JSON.stringify({ top: pos.top, left: pos.left }));
    }
  });
}

$j(() => setTimeout(() => main(), 100));

function main() {
  $j('div.AdBlock').remove();
  let savedPos;
  try {
    savedPos = JSON.parse(GM_getValue('floatingPanelPos', '{}'));
  } catch {
    savedPos = {};
  }

  const top = typeof savedPos.top === 'number' ? savedPos.top : 80;
  const left = typeof savedPos.left === 'number' ? savedPos.left : null;
  const positionStyle = `top:${top}px; ${left !== null ? `left:${left}px;` : 'left:0;'}`;

  const $panel = $j(`
     <div id="floatingPanel" style="position:fixed; ${positionStyle} width:300px; max-height:80vh; overflow:auto; background:#fff; border:1px solid #ccc; z-index:10000; box-shadow:0 0 10px rgba(0,0,0,0.2); font-size:13px;">
      <div id="floatingHeader" style="background:#f0f0f0; padding:8px; font-weight:bold; text-align:center;">Проверка новых серий на ${domain} <img title="Пересоздать таблицу" id="imgrefreshtable" src="${ICONS.renewImg}" style="cursor:pointer;margin-left:10px;vertical-align:middle;"/></div>
      <div style="padding:8px;">
        <table id="episodesTable" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr><th>Сериал</th><th>Действие</th></tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`);

  $j('body').append($panel);
  enableDragging($panel, $j('#floatingHeader'))
  $j('div.UnwatchedEpisodeItem').each((i, el) => addFloatingRow($j(el), i));
}

function normalizeTitle(title) {
  title = title.trim().replace(/\s{2,}/g, ' ');
  switch (title) {
    case "Звездный": return "Звёздный";
    case "Звёздный путь: Пикар": return "Звездный путь: Пикар";
    case "Детство Шелдона": return "Молодой Шелдон";
    case "Студия Marvel: Легенды": return "Marvel Studios: Легенды";
    default: return title;
  }
}

function addFloatingRow($item, index) {

  const $parent = $item.closest('div[id^="s"]');

  const name = normalizeTitle($parent.find('.Unwatched-showTitle-title').text());
  const season = $parent.find('.Unwatched-showSeasonTitle').text().split('Сезон')[1]?.trim() || '';
  const serie = $item.find('.UnwatchedEpisodeItem__index span').text().trim();
  const title = `${name} ${season} сезон ${serie} серия [Смотреть Онлайн]`;

  const rowHTML = `
    <tr>
      <td style="border: 1px solid #ccc; padding: 4px; vertical-align:top; text-align: center;">${name}<br><small>${season}_сезон ${serie}_серия</small><div style="margin-top: 10px;text-align: center;" id="res${index}"></div></td>
      <td style="border: 1px solid #ccc; padding: 4px; text-align:center; ">
        <button id="chk${index}" style="padding:2px 6px;">Проверить</button>
		<button id="delit${index}" style="padding:2px 6px; color:red" title="Удалить строку">X</button>
      </td>
    </tr>`;

	$j('#episodesTable tbody').append(rowHTML);
	$j(`#chk${index}`).on('click', () => {
		$j(`#res${index}`).html(`<img src='${ICONS.loading}' style='height:16px;' />`);
		searchEpisode(domain, index, title, name, season, serie);
	});
	$j('#imgrefreshtable').on('click', () => {
		$j('#episodesTable').find('tbody').find('tr').each(function(){
			$j(this).remove();
		})
		$j('div.UnwatchedEpisodeItem').each((i, el) => addFloatingRow($j(el), i));
	});
	$j(`#delit${index}`).on('click',function(){
		$j(this).closest('tr').remove();
	});
}

function searchEpisode(domain, index, fullTitle, name, season, serie) {
  const pages = [...Array(7).keys()].map(n => n + 1);
  let found = false;
  let stop = false;

  (function searchNext(pagesList) {
    if (pagesList.length === 0 || stop) {
      if (!found) showNotFound(index);
      return;
    }

    const page = pagesList.shift();
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://${domain}/news/?page${page}`,
      onload: res => {
        const doc = new DOMParser().parseFromString(res.responseText, "text/html");
        const el = [...doc.getElementsByClassName('kino-h')];

        for (const link of el) {
          if (link.getAttribute('title')?.toLowerCase().includes(fullTitle.toLowerCase())) {
            found = true;
            stop = true;
            const href = link.getAttribute('href');
            fetchTorrent(domain, href, index, name, season, serie);
            return;
          }
        }

        searchNext(pagesList);
      }
    });
  })([...pages]);
}

function fetchTorrent(domain, href, index, name, season, serie) {
  GM.xmlHttpRequest({
    method: "GET",
    url: `https://${domain}${href}`,
    onload: res => {
      const doc = new DOMParser().parseFromString(res.responseText, "text/html");
      const title = doc.querySelector('.kino-h')?.innerText || '';
      const link = doc.querySelector('.player-box a')?.getAttribute('href');

      if (!link) return showNotFound(index);
      const q = link.replace(/(.*)(1080|720|400)[ррPР]?(.*)/ig, '$2');
      const html = `
        <div id="nameblock">${title}</div>
		<div id="hrefblock">
        <a href="https://${domain}${link}" target="_blank">
        <img src="${ICONS.torrent}" style="width:20px;vertical-align:middle;"/> ${q}p</a>
        | <a href="https://${domain}${href}" target="_blank" title="${title}">Смотреть</a></div>`;

      $j(`#res${index}`).html(html);
    }
  });
}
GM_registerMenuCommand("Пересоздать таблицу", function() {
	$j('#episodesTable').find('tbody').find('tr').each(function(){
	$j(this).remove();
	})
	$j('div.UnwatchedEpisodeItem').each((i, el) => addFloatingRow($j(el), i));
});
function showNotFound(index) {
  $j(`#res${index}`).html(`<img src="${ICONS.notfound}" title="Серия ещё не переведена" style="height:20px;"/>`);
}