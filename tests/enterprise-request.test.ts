import test from "node:test";
import assert from "node:assert/strict";
import { enterpriseEmail, parseEnterprise, escapeHtml } from "../src/lib/enterprise/request";
const valid = { name:"Test User",email:"user@example.org",company:"Example",jobTitle:"cto",teamSize:"1-10",useCase:"api-gateway",deployment:"hybrid",message:"Please contact us",timeline:"",budget:"",sla:"" };
test("accepts existing EnterpriseForm payload",()=>assert.deepEqual(parseEnterprise(valid),valid));
test("rejects unsupported selections",()=>assert.equal(parseEnterprise({...valid,sla:"free-premium"}),null));
test("rejects invalid fields and oversized strings",()=>{
  assert.equal(parseEnterprise({...valid,email:"invalid"}),null);
  assert.equal(parseEnterprise({...valid,message:"a".repeat(5001)}),null);
  assert.equal(parseEnterprise({...valid,company:42}),null);
});
test("escapes untrusted HTML for email",()=>{
  const d = parseEnterprise({...valid,name:'<img src=x onerror="test">',message:'Hello <script>alert(1)</script> & hello'})!;
  const email = enterpriseEmail(d);
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.html.includes('&lt;img'));
  assert.ok(email.html.includes('&amp; hello'));
  assert.ok(email.text.includes('<script>')); // plain text remains intact
  assert.equal(escapeHtml('"\'&<>'), '&quot;&#39;&amp;&lt;&gt;');
});
