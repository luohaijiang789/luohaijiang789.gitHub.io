import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { lessons, sections } from '../src/data/english/curriculum.mjs';
import maps from '../src/data/english/word-maps.json' with { type: 'json' };
import bank from '../src/data/english/core-vocabulary.json' with { type: 'json' };
import questions from '../src/data/english/checkpoint.json' with { type: 'json' };
import { emptyProgress, normalizeProgress } from '../src/lib/progress.mjs';

async function readLesson(slug){const base=`src/content/docs/english/${slug}`;try{return await readFile(base+'.md','utf8');}catch{return readFile(base+'.mdx','utf8');}}
test('every course entry has an actual article, a matching title and explained practice',async()=>{
 assert.equal(new Set(lessons.map(l=>l.slug)).size,lessons.length);
 for(const section of sections)await access(`src/content/docs/english/${section.slug}/index.md`);
 for(const lesson of lessons){const text=await readLesson(lesson.slug);assert.ok(text.includes(lesson.title),lesson.slug+' title');assert.ok(text.includes('练习'),lesson.slug+' practice');if(!lesson.slug.endsWith('roadmap'))assert.ok(text.includes('<details>'),lesson.slug+' answers');assert.ok(!/TODO|待补充|敬请期待|内容即将上线/.test(text),lesson.slug+' placeholder');}
});
test('every authored meaning map is embedded in a real article',async()=>{
 const text=(await Promise.all(lessons.map(l=>readLesson(l.slug)))).join('\n');
 assert.equal(new Set(maps.map(m=>m.name)).size,maps.length);
 for(const map of maps){assert.ok(text.includes(`name="${map.name}"`),map.name);assert.ok(map.code.includes('accTitle:')&&map.code.includes('accDescr:'),map.name+' accessible summary');}
});
test('checkpoint recommendations resolve to lessons and answer keys are valid',()=>{
 for(const q of questions){assert.ok(lessons.some(l=>l.slug===q.lesson));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation);}
 assert.ok(bank.every(group=>group.entries.every(entry=>entry.word&&entry.meaning&&entry.chunk)));
});
test('lesson completion survives v1 backup normalization without discarding previous data',()=>{
 const p={...emptyProgress(),notes:'Original writing',english:{wordNotes:{inspect:'My mnemonic'},sceneDrafts:{cafe:'To go.'},completedLessons:[lessons[0].slug,lessons[0].slug,'missing-lesson']}};
 const normalized=normalizeProgress(JSON.parse(JSON.stringify(p)));
 assert.deepEqual(normalized.english.completedLessons,[lessons[0].slug]);assert.equal(normalized.notes,'Original writing');assert.equal(normalized.english.wordNotes.inspect,'My mnemonic');assert.equal(normalized.english.sceneDrafts.cafe,'To go.');
});
