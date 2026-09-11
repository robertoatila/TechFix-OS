import 'react-native-url-polyfill/auto';

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wrqzhjbpnwszsfwshnsi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CYUR6NFp_vKzAGbb5pEShA_buu1UgUm';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const STATUS_ANALISE = 'Em Análise';
const STATUS_PECA = 'Aguardando Peça';
const STATUS_CONCLUIDO = 'Concluído';

function mostrarAlerta(titulo, mensagem) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }

  Alert.alert(titulo, mensagem);
}

function StatusSelector({ value, onChange, disabled = false }) {
  return (
    <View style={styles.statusContainer}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onChange(STATUS_ANALISE)}
        style={[
          styles.statusButton,
          value === STATUS_ANALISE && styles.statusAnalise,
        ]}
      >
        <Text style={styles.statusText}>Em Análise</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={disabled}
        onPress={() => onChange(STATUS_PECA)}
        style={[
          styles.statusButton,
          value === STATUS_PECA && styles.statusPeca,
        ]}
      >
        <Text style={styles.statusText}>Aguardando Peça</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={disabled}
        onPress={() => onChange(STATUS_CONCLUIDO)}
        style={[
          styles.statusButton,
          value === STATUS_CONCLUIDO && styles.statusConcluido,
        ]}
      >
        <Text style={styles.statusText}>Concluído</Text>
      </TouchableOpacity>
    </View>
  );
}

function FormHeader({
  totalOrdens,
  emAndamento,
  concluidas,
  modelo,
  setModelo,
  defeito,
  setDefeito,
  custoPeca,
  setCustoPeca,
  maoDeObra,
  setMaoDeObra,
  status,
  setStatus,
  salvando,
  erroFormulario,
  limparErro,
  cadastrarOrdem,
  calcularTotal,
  formatarMoeda,
  pesquisa,
  setPesquisa,
  carregarOrdens,
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.logo}>TechFix OS</Text>
        <Text style={styles.subtitulo}>Gestão de Ordens de Serviço</Text>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardNumero}>{totalOrdens}</Text>
          <Text style={styles.dashboardTexto}>Total de OS</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardNumero}>{emAndamento}</Text>
          <Text style={styles.dashboardTexto}>Em andamento</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardNumero}>{concluidas}</Text>
          <Text style={styles.dashboardTexto}>Concluídas</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Nova Ordem de Serviço</Text>

        <Text style={styles.inputLabel}>Modelo do aparelho</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: iPhone 13"
          placeholderTextColor="#94a3b8"
          value={modelo}
          onChangeText={(texto) => {
            setModelo(texto);
            limparErro();
          }}
        />

        <Text style={styles.inputLabel}>Defeito relatado</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ex.: Tela quebrada"
          placeholderTextColor="#94a3b8"
          value={defeito}
          onChangeText={(texto) => {
            setDefeito(texto);
            limparErro();
          }}
          multiline
        />

        <View style={styles.valoresRow}>
          <View style={styles.valorColunaEsquerda}>
            <Text style={styles.inputLabel}>Custo da peça</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor="#94a3b8"
              value={custoPeca}
              onChangeText={(texto) => {
                setCustoPeca(texto);
                limparErro();
              }}
              keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
            />
          </View>

          <View style={styles.valorColunaDireita}>
            <Text style={styles.inputLabel}>Mão de obra</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor="#94a3b8"
              value={maoDeObra}
              onChangeText={(texto) => {
                setMaoDeObra(texto);
                limparErro();
              }}
              keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
            />
          </View>
        </View>

        <View style={styles.totalPreview}>
          <Text style={styles.totalPreviewLabel}>Total da OS</Text>
          <Text style={styles.totalPreviewValor}>
            {formatarMoeda(calcularTotal(custoPeca, maoDeObra))}
          </Text>
        </View>

        {erroFormulario ? (
          <View style={styles.erroBox}>
            <Text style={styles.erroTexto}>{erroFormulario}</Text>
          </View>
        ) : null}

        <Text style={styles.inputLabel}>Status</Text>
        <StatusSelector
          value={status}
          onChange={setStatus}
          disabled={salvando}
        />

        <TouchableOpacity
          style={[styles.botaoPrincipal, salvando && styles.desabilitado]}
          onPress={cadastrarOrdem}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.botaoPrincipalTexto}>Cadastrar OS</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listaHeader}>
        <Text style={styles.sectionTitle}>Ordens de Serviço</Text>
        <TouchableOpacity onPress={carregarOrdens}>
          <Text style={styles.atualizar}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.pesquisa}
        placeholder="Pesquisar aparelho ou defeito..."
        placeholderTextColor="#94a3b8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />
    </View>
  );
}

export default function App() {
  const [ordens, setOrdens] = useState([]);
  const [modelo, setModelo] = useState('');
  const [defeito, setDefeito] = useState('');
  const [custoPeca, setCustoPeca] = useState('');
  const [maoDeObra, setMaoDeObra] = useState('');
  const [status, setStatus] = useState(STATUS_ANALISE);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroFormulario, setErroFormulario] = useState('');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editModelo, setEditModelo] = useState('');
  const [editDefeito, setEditDefeito] = useState('');
  const [editCustoPeca, setEditCustoPeca] = useState('');
  const [editMaoDeObra, setEditMaoDeObra] = useState('');
  const [editStatus, setEditStatus] = useState(STATUS_ANALISE);
  const [erroEdicao, setErroEdicao] = useState('');

  useEffect(() => {
    carregarOrdens();
  }, []);

  function converterNumero(valor) {
    const texto = String(valor ?? '').trim().replace(/\s/g, '');

    if (!texto) return 0;

    if (texto.includes(',')) {
      return Number(texto.replace(/\./g, '').replace(',', '.'));
    }

    return Number(texto);
  }

  function calcularTotal(custo, mao) {
    const custoNumero = converterNumero(custo);
    const maoNumero = converterNumero(mao);

    return (
      (Number.isFinite(custoNumero) ? custoNumero : 0) +
      (Number.isFinite(maoNumero) ? maoNumero : 0)
    );
  }

  function formatarMoeda(valor) {
    return (Number(valor) || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function validarFormulario(modeloValor, defeitoValor, custoValor, maoValor, definirErro) {
    definirErro('');

    if (!modeloValor.trim()) {
      const mensagem = 'Informe o modelo do aparelho.';
      definirErro(mensagem);
      mostrarAlerta('Atenção', mensagem);
      return false;
    }

    if (!defeitoValor.trim()) {
      const mensagem = 'Informe o defeito relatado.';
      definirErro(mensagem);
      mostrarAlerta('Atenção', mensagem);
      return false;
    }

    const custo = converterNumero(custoValor);
    const mao = converterNumero(maoValor);

    if (!Number.isFinite(custo) || !Number.isFinite(mao)) {
      const mensagem = 'Informe valores numéricos válidos.';
      definirErro(mensagem);
      mostrarAlerta('Atenção', mensagem);
      return false;
    }

    if (custo < 0 || mao < 0) {
      const mensagem = 'Os valores não podem ser negativos.';
      definirErro(mensagem);
      mostrarAlerta('Atenção', mensagem);
      return false;
    }

    return true;
  }

  async function carregarOrdens() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdens(data || []);
    } catch (error) {
      console.error(error);
      mostrarAlerta('Erro', `Não foi possível carregar as ordens.\n\n${error.message || ''}`);
    } finally {
      setLoading(false);
    }
  }

  async function cadastrarOrdem() {
    if (!validarFormulario(
      modelo,
      defeito,
      custoPeca,
      maoDeObra,
      setErroFormulario
    )) return;

    try {
      setSalvando(true);

      const { error } = await supabase.from('ordens_servico').insert([
        {
          modelo_aparelho: modelo.trim(),
          defeito_relatado: defeito.trim(),
          custo_peca: converterNumero(custoPeca),
          valor_mao_de_obra: converterNumero(maoDeObra),
          status_os: status,
        },
      ]);

      if (error) throw error;

      setModelo('');
      setDefeito('');
      setCustoPeca('');
      setMaoDeObra('');
      setStatus(STATUS_ANALISE);
      setErroFormulario('');
      await carregarOrdens();
      mostrarAlerta('Sucesso', 'Ordem de serviço cadastrada.');
    } catch (error) {
      console.error(error);
      mostrarAlerta('Erro', `Não foi possível cadastrar a OS.\n\n${error.message || ''}`);
    } finally {
      setSalvando(false);
    }
  }

  function abrirEdicao(ordem) {
    setEditandoId(ordem.id);
    setEditModelo(ordem.modelo_aparelho || '');
    setEditDefeito(ordem.defeito_relatado || '');
    setEditCustoPeca(String(ordem.custo_peca ?? 0));
    setEditMaoDeObra(String(ordem.valor_mao_de_obra ?? 0));
    setEditStatus(ordem.status_os || STATUS_ANALISE);
    setErroEdicao('');
    setModalVisivel(true);
  }

  function fecharEdicao() {
    if (salvando) return;
    setModalVisivel(false);
    setEditandoId(null);
    setErroEdicao('');
  }

  async function editarOrdem() {
    if (!validarFormulario(
      editModelo,
      editDefeito,
      editCustoPeca,
      editMaoDeObra,
      setErroEdicao
    )) return;

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('ordens_servico')
        .update({
          modelo_aparelho: editModelo.trim(),
          defeito_relatado: editDefeito.trim(),
          custo_peca: converterNumero(editCustoPeca),
          valor_mao_de_obra: converterNumero(editMaoDeObra),
          status_os: editStatus,
        })
        .eq('id', editandoId);

      if (error) throw error;

      setModalVisivel(false);
      setEditandoId(null);
      await carregarOrdens();
      mostrarAlerta('Sucesso', 'Ordem de serviço atualizada.');
    } catch (error) {
      console.error(error);
      mostrarAlerta('Erro', `Não foi possível editar a OS.\n\n${error.message || ''}`);
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(ordem) {
    const mensagem = `Deseja excluir a OS #${ordem.id}?`;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(mensagem)) excluirOrdem(ordem.id);
      return;
    }

    Alert.alert('Excluir ordem de serviço', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirOrdem(ordem.id) },
    ]);
  }

  async function excluirOrdem(id) {
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await carregarOrdens();
    } catch (error) {
      console.error(error);
      mostrarAlerta('Erro', `Não foi possível excluir a OS.\n\n${error.message || ''}`);
    }
  }

  function coresStatus(statusAtual) {
    if (statusAtual === STATUS_CONCLUIDO) {
      return { borda: '#22c55e', fundo: '#dcfce7', texto: '#166534' };
    }
    if (statusAtual === STATUS_PECA) {
      return { borda: '#f97316', fundo: '#ffedd5', texto: '#9a3412' };
    }
    return { borda: '#eab308', fundo: '#fef9c3', texto: '#854d0e' };
  }

  const ordensFiltradas = ordens.filter((ordem) => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return true;

    return (
      String(ordem.modelo_aparelho || '').toLowerCase().includes(termo) ||
      String(ordem.defeito_relatado || '').toLowerCase().includes(termo)
    );
  });

  const totalOrdens = ordens.length;
  const concluidas = ordens.filter(
    (ordem) => ordem.status_os === STATUS_CONCLUIDO
  ).length;
  const emAndamento = totalOrdens - concluidas;

  function renderizarOrdem({ item }) {
    const cores = coresStatus(item.status_os);

    return (
      <View style={[styles.card, { borderLeftColor: cores.borda }]}>
        <View style={styles.cardTopo}>
          <Text style={styles.numeroOs}>OS #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: cores.fundo }]}>
            <Text style={[styles.statusBadgeText, { color: cores.texto }]}>
              ● {item.status_os}
            </Text>
          </View>
        </View>

        <Text style={styles.modeloCard}>{item.modelo_aparelho}</Text>
        <Text style={styles.labelCard}>Defeito relatado</Text>
        <Text style={styles.defeitoCard}>{item.defeito_relatado}</Text>

        <View style={styles.divisor} />

        <View style={styles.valorLinha}>
          <Text style={styles.valorLabel}>Peça</Text>
          <Text>{formatarMoeda(item.custo_peca)}</Text>
        </View>
        <View style={styles.valorLinha}>
          <Text style={styles.valorLabel}>Mão de obra</Text>
          <Text>{formatarMoeda(item.valor_mao_de_obra)}</Text>
        </View>
        <View style={[styles.valorLinha, styles.totalLinha]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>
            {formatarMoeda(calcularTotal(item.custo_peca, item.valor_mao_de_obra))}
          </Text>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity style={styles.botaoEditar} onPress={() => abrirEdicao(item)}>
            <Text style={styles.botaoEditarTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => confirmarExclusao(item)}>
            <Text style={styles.botaoExcluirTexto}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />

      <FlatList
        data={ordensFiltradas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarOrdem}
        contentContainerStyle={styles.listaConteudo}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={
          <FormHeader
            totalOrdens={totalOrdens}
            emAndamento={emAndamento}
            concluidas={concluidas}
            modelo={modelo}
            setModelo={setModelo}
            defeito={defeito}
            setDefeito={setDefeito}
            custoPeca={custoPeca}
            setCustoPeca={setCustoPeca}
            maoDeObra={maoDeObra}
            setMaoDeObra={setMaoDeObra}
            status={status}
            setStatus={setStatus}
            salvando={salvando}
            erroFormulario={erroFormulario}
            limparErro={() => setErroFormulario('')}
            cadastrarOrdem={cadastrarOrdem}
            calcularTotal={calcularTotal}
            formatarMoeda={formatarMoeda}
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            carregarOrdens={carregarOrdens}
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />
          ) : (
            <Text style={styles.vazio}>Nenhuma OS encontrada.</Text>
          )
        }
      />

      <Modal
        visible={modalVisivel}
        animationType="slide"
        onRequestClose={fecharEdicao}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.modalConteudo}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitulo}>Editar OS</Text>
                <Text style={styles.modalSubtitulo}>OS #{editandoId}</Text>
              </View>
              <TouchableOpacity onPress={fecharEdicao}>
                <Text style={styles.atualizar}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Modelo do aparelho</Text>
            <TextInput
              style={styles.input}
              value={editModelo}
              onChangeText={(texto) => {
                setEditModelo(texto);
                setErroEdicao('');
              }}
            />

            <Text style={styles.inputLabel}>Defeito relatado</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={editDefeito}
              onChangeText={(texto) => {
                setEditDefeito(texto);
                setErroEdicao('');
              }}
              multiline
            />

            <Text style={styles.inputLabel}>Custo da peça</Text>
            <TextInput
              style={styles.input}
              value={editCustoPeca}
              onChangeText={(texto) => {
                setEditCustoPeca(texto);
                setErroEdicao('');
              }}
              keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
            />

            <Text style={styles.inputLabel}>Mão de obra</Text>
            <TextInput
              style={styles.input}
              value={editMaoDeObra}
              onChangeText={(texto) => {
                setEditMaoDeObra(texto);
                setErroEdicao('');
              }}
              keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
            />

            <View style={styles.totalPreview}>
              <Text style={styles.totalPreviewLabel}>Total atualizado</Text>
              <Text style={styles.totalPreviewValor}>
                {formatarMoeda(calcularTotal(editCustoPeca, editMaoDeObra))}
              </Text>
            </View>

            {erroEdicao ? (
              <View style={styles.erroBox}>
                <Text style={styles.erroTexto}>{erroEdicao}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Status</Text>
            <StatusSelector
              value={editStatus}
              onChange={setEditStatus}
              disabled={salvando}
            />

            <TouchableOpacity
              style={[styles.botaoPrincipal, salvando && styles.desabilitado]}
              onPress={editarOrdem}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.botaoPrincipalTexto}>Salvar alterações</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={fecharEdicao}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f1f5f9' },
  listaConteudo: { padding: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 18 },
  logo: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  subtitulo: { marginTop: 3, fontSize: 15, color: '#64748b' },
  dashboard: { flexDirection: 'row', marginBottom: 18 },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dashboardNumero: { fontSize: 23, fontWeight: '800', color: '#2563eb' },
  dashboardTexto: { marginTop: 4, fontSize: 11, color: '#64748b', textAlign: 'center' },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  inputLabel: { fontSize: 13, color: '#475569', fontWeight: '700', marginBottom: 6, marginTop: 8 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: '#0f172a',
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  valoresRow: { flexDirection: 'row' },
  valorColunaEsquerda: { flex: 1, marginRight: 5 },
  valorColunaDireita: { flex: 1, marginLeft: 5 },
  totalPreview: {
    marginTop: 14,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPreviewLabel: { color: '#475569', fontWeight: '700' },
  totalPreviewValor: { color: '#1d4ed8', fontSize: 20, fontWeight: '800' },
  erroBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 10,
    padding: 11,
    marginTop: 12,
  },
  erroTexto: { color: '#b91c1c', fontWeight: '700', textAlign: 'center' },
  statusContainer: { marginTop: 2, marginBottom: 8 },
  statusButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 9,
    marginBottom: 6,
  },
  statusAnalise: { backgroundColor: '#fef9c3', borderColor: '#eab308' },
  statusPeca: { backgroundColor: '#ffedd5', borderColor: '#f97316' },
  statusConcluido: { backgroundColor: '#dcfce7', borderColor: '#22c55e' },
  statusText: { textAlign: 'center', fontWeight: '700', color: '#0f172a' },
  botaoPrincipal: {
    backgroundColor: '#2563eb',
    borderRadius: 11,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoPrincipalTexto: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
  desabilitado: { opacity: 0.55 },
  listaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  atualizar: { color: '#2563eb', fontWeight: '700', marginBottom: 14 },
  pesquisa: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 5,
  },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  numeroOs: { color: '#1d4ed8', fontWeight: '800', fontSize: 13 },
  statusBadge: { paddingVertical: 5, paddingHorizontal: 9, borderRadius: 20 },
  statusBadgeText: { fontWeight: '700', fontSize: 11 },
  modeloCard: { color: '#0f172a', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  labelCard: { color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  defeitoCard: { color: '#334155', fontSize: 14, lineHeight: 20 },
  divisor: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 14 },
  valorLinha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  valorLabel: { color: '#64748b', fontSize: 14 },
  totalLinha: { marginTop: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  totalLabel: { color: '#0f172a', fontWeight: '800', fontSize: 15 },
  totalValor: { color: '#2563eb', fontWeight: '800', fontSize: 18 },
  acoes: { flexDirection: 'row', marginTop: 13 },
  botaoEditar: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 9,
    alignItems: 'center',
    paddingVertical: 11,
    marginRight: 5,
  },
  botaoEditarTexto: { color: '#1d4ed8', fontWeight: '800' },
  botaoExcluir: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 9,
    alignItems: 'center',
    paddingVertical: 11,
    marginLeft: 5,
  },
  botaoExcluirTexto: { color: '#ffffff', fontWeight: '800' },
  loading: { marginTop: 30 },
  vazio: { textAlign: 'center', color: '#64748b', marginTop: 30 },
  modalConteudo: { padding: 18, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitulo: { color: '#0f172a', fontSize: 25, fontWeight: '800' },
  modalSubtitulo: { color: '#64748b', marginTop: 2 },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 11,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    backgroundColor: '#ffffff',
  },
  botaoCancelarTexto: { color: '#475569', fontWeight: '700' },
});
