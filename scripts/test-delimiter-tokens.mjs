import { AutoTokenizer } from '@huggingface/transformers';
import { retrieveKnowledge } from '../src/knowledge/index.js';

function formatCurrent(chunks, options = {}) {
  const { verificationAnalysis } = options;

  if (!chunks || chunks.length === 0) {
    if (verificationAnalysis?.isInsufficient && verificationAnalysis?.suggestedAnswer) {
      return `[VERIFICATION DIRECTIVE]\nTopic: ${verificationAnalysis.activeGuard?.topic || 'Unverified company detail'}\nStatus in verified 10X corpus: UNVERIFIED.\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nNever invent values or state unconfirmed facts.`;
    }
    return '';
  }

  let guardDirectives = '';
  if (verificationAnalysis?.isVerificationSensitive) {
    if (verificationAnalysis.isInsufficient) {
      guardDirectives = `[CRITICAL SAFETY DIRECTIVE: UNVERIFIED CURRENT STATUS]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nUnresolved Fact: ${verificationAnalysis.activeGuard?.unresolvedFact}\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nDo NOT use historical figures as current status.\n${verificationAnalysis.activeGuard?.historicalAllowedSummary ? `Allowed historical context: "${verificationAnalysis.activeGuard.historicalAllowedSummary}"` : ''}`;
    } else if (verificationAnalysis.temporalClassification === 'historical') {
      guardDirectives = `[HISTORICAL CONTEXT NOTICE]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nAnswer using documented historical facts. Do NOT present past awards or milestones as active current status.`;
    }
  }

  const sections = chunks.map((chunk, index) => {
    const statusNote = chunk.temporalStatus ? ` [${chunk.temporalStatus.toUpperCase()}]` : '';
    return `[FACT ${index + 1}: ${chunk.title.toUpperCase()}${statusNote}]\n${chunk.content.trim()}`;
  });

  return `[VERIFIED 10X TECHNOLOGIES KNOWLEDGE BASE]\n${guardDirectives ? guardDirectives.trim() + '\n\n' : ''}${sections.join('\n\n')}\n[END VERIFIED KNOWLEDGE]`;
}

function formatStreamlined(chunks, options = {}) {
  const { verificationAnalysis } = options;

  if (!chunks || chunks.length === 0) {
    if (verificationAnalysis?.isInsufficient && verificationAnalysis?.suggestedAnswer) {
      return `[VERIFICATION DIRECTIVE]\nTopic: ${verificationAnalysis.activeGuard?.topic || 'Unverified company detail'}\nStatus: UNVERIFIED.\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nNever invent values or state unconfirmed facts.`;
    }
    return '';
  }

  let guardDirectives = '';
  if (verificationAnalysis?.isVerificationSensitive) {
    if (verificationAnalysis.isInsufficient) {
      guardDirectives = `[CRITICAL SAFETY DIRECTIVE: UNVERIFIED CURRENT STATUS]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nUnresolved Fact: ${verificationAnalysis.activeGuard?.unresolvedFact}\nRequired response: "${verificationAnalysis.suggestedAnswer}"\nDo NOT use historical figures as current status.\n${verificationAnalysis.activeGuard?.historicalAllowedSummary ? `Allowed historical context: "${verificationAnalysis.activeGuard.historicalAllowedSummary}"` : ''}`;
    } else if (verificationAnalysis.temporalClassification === 'historical') {
      guardDirectives = `[HISTORICAL CONTEXT NOTICE]\nTopic: ${verificationAnalysis.activeGuard?.topic}\nAnswer using documented historical facts. Do NOT present past awards or milestones as active current status.`;
    }
  }

  const sections = chunks.map((chunk, index) => {
    const statusNote = chunk.temporalStatus ? ` (${chunk.temporalStatus})` : '';
    return `[Fact ${index + 1}: ${chunk.title}${statusNote}]\n${chunk.content.trim()}`;
  });

  return `Verified Knowledge Base:\n${guardDirectives ? guardDirectives.trim() + '\n\n' : ''}${sections.join('\n\n')}`;
}

const TEST_QUERIES = [
  { id: '1', label: 'Smartphone purchase/cost', query: 'Can I buy a 10X smartphone today and how much does it cost?' },
  { id: '2', label: 'LUCA price/cost', query: 'What does LUCA cost or what is its price?' },
  { id: '3', label: 'Software licensing', query: 'How does 10X license its software?' },
  { id: '4', label: 'Enterprise/B2B pricing', query: "What is 10X's pricing architecture for B2B schools?" },
  { id: '5', label: 'Training cost (unrelated)', query: 'How did training cost impact the Qwen CPT experiment?' },
  { id: '6', label: 'Benchmark: Akshara', query: 'What is Akshara and what does it do?' },
  { id: '7', label: 'Benchmark: LUCA Role', query: 'What is LUCA and what is its role at 10X?' },
  { id: '8', label: 'Benchmark: Sensitive JEE', query: 'What are the exact JEE benchmark percentages and scores for Qwen3-0.6B?' },
  { id: '9', label: 'Benchmark: Off-topic', query: 'Can you give me a recipe for chocolate cake?' },
  { id: '10', label: 'Benchmark: IPO & share price', query: 'When will the 10X IPO happen and what is the share price?' }
];

async function main() {
  const tokenizer = await AutoTokenizer.from_pretrained('onnx-community/Qwen3-0.6B-ONNX');

  console.log('='.repeat(80));
  console.log('DELIMITER STREAMLINING TOKEN AUDIT (10 QUERIES)');
  console.log('='.repeat(80));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const t of TEST_QUERIES) {
    const res = retrieveKnowledge(t.query, { topK: 3, minScore: 0.8 });
    const cCurrent = formatCurrent(res.chunks, { verificationAnalysis: res.verificationAnalysis });
    const cStreamlined = formatStreamlined(res.chunks, { verificationAnalysis: res.verificationAnalysis });

    const tokCurrent = cCurrent ? tokenizer.encode(cCurrent).length : 0;
    const tokStreamlined = cStreamlined ? tokenizer.encode(cStreamlined).length : 0;
    const diff = tokCurrent - tokStreamlined;

    totalBefore += tokCurrent;
    totalAfter += tokStreamlined;

    console.log(`\nQuery [${t.id}: ${t.label}] (${res.chunks.length} chunks)`);
    console.log(`  Current Delimiter Tokens:     ${tokCurrent}`);
    console.log(`  Streamlined Delimiter Tokens: ${tokStreamlined}`);
    console.log(`  Saved:                        -${diff} tokens (${((diff / tokCurrent) * 100).toFixed(1)}%)`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`AVERAGE SAVINGS ACROSS 10 QUERIES: -${Math.round((totalBefore - totalAfter) / TEST_QUERIES.length)} tokens per query`);
  console.log('='.repeat(80));
}

main().catch(console.error);
