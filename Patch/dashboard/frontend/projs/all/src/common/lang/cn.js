'use strict';

const cn = {
  header: {
    brand: 'Dashboard',

    home: '��ҳ', // 1

    insurance: '�����г�', // 2
    market: '���ռ���', // 21
    analytics: '���ݷ���', // 22

    whitePaper: '��Ƥ��', // 3
    faq: '��������', // 4
    login: '��¼', // 5
    signUp: '���ע��', // 6
    admin: '����Ա', // 6

    // pic 7
    user: '��������', // 71
    logout: 'ע��', // 72

    lang: '���ģ����壩' // 8
  },
  // DONE
  home: {
    slot1: {
      title: ['Dashboard', '�����ݷ���', '��˽��ȫ'],
      content: [
        '���������������Ĵ����ͱ������ݷ���ƽ̨',
        '�����˹����ܵĴ����ݷ���',
        '�������ݰ�ȫ�͸�����˽Ȩ'
      ]
    },
    slot2: {
      header: '��Ʒ����',
      title: ['��������', '�����ݷ���', '��˽��ȫ', '��ҵ����'],
      content: [
        '����ҵ������������������������֮�ϵ���Ϣ��ʵ�ɿ�������������ݲ��ɴ۸ġ��Ƴ����༭��α�졣',
        '����˹����ܣ�Ϊ������ҵ���ƾ�׼�ķ�ط���������ģ�ͣ����Ի��������������ֵ��ṩ������֧�š�',
        '�˻������Ϣ�߶ȼ��ܣ���Ϣ��û�еõ��ṩ����Ȩ������˽�����ģ���֤�����ݰ�ȫ�͸�����˽Ȩ��',
        'ͨ��������������������ϵͳ����Ϣ���ɴ۸ģ�����α�죬Ϊ���Ż����ṩ��ʵ�ɿ���������Դ��'
      ]
    },
    slot3: {
      title: '��Ʒ����',
      content: 'Dashboard��һ�����������������Ĵ����ͱ������ݷ���ƽ̨���û��ͱ�����Ϣͨ��ƽ̨�������û���Ϣ��û�еõ��ṩ����Ȩ������˽�����ġ�ƽ̨����˹����ܶ��������ϵĴ����ݽ��ж��ƻ�������'
    },
    slot4: {
      header: '��Ʒ��ɫ',
      title: ['', '', '', ''],
      content: [
        '��ͨ�û���ͨ��ƽ̨����Ŀǰ�������չ�˾�ı��ղ�Ʒ��ͨ�������ݷ������ҵ��ʺ��Լ��ı��ղ�Ʒ��',
        'Ϊ�����û���߼���Ա���ṩ������˽����������֧�ŷ������ݿ���������������֣����Ƹ��Ի���������׼Ӫ���ȣ���',
        '�ṩƽ̨�ĸ��ֶ�������ģ��API��Ϊϵͳ���ƻ�������ϵͳ�����ṩ�ӿڶԽӷ���',
        'ͨ����Դ�������м�ɱ�����ֵ���ݶ����������繱�׳̶ȷ��䵽���ڵ㣬�����������ڵ�������롣'
      ]
    },
    slot5: {
      header: '��ϵ��ʽ'
    }
  },
  login: {
    title: '�û���¼',
    account: '�������ֻ��Ż������ַ',
    password: '�������¼����',
    submit: '��¼',
    dialog: {
      title: '�ȸ���֤',
      placeholder: '������ȸ���֤��',
      buttonText: 'ȷ��'
    }
  },
  signUp: {
    phoneTitle: '�ֻ�ע��',
    emailTitle: '����ע��',
    quickTitle: '����ע��',
    phonePlaceholder: '�������ֻ���',
    emailPlaceholder: '�����������ַ',
    quickPlaceholder: '�������˺�',
    getCode: '��ȡ��֤��',
    retrieveCode: '���»�ȡ',
    code: '������6λ��֤��',
    password: '����������',
    password2: '���ٴ���������',
    submit: 'ע��'
  },
  market: {
    operation: {
      title: ['ѡ���չ�˾', '�������ղ�Ʒ']
    },
    pingan: {
      category: '�������ͣ�',
      period: '�������ޣ�',
      input: '¼���ҵı���'
    },
    picc: {
      category: '�������ͣ�',
      age: '�������䣺',
      period: '�������ޣ�',
      input: '¼���ҵı���'
    },
    dialog: {
      title: '�ҵı���',
      product: {
        title: '��Ʒ��Ϣ',
        company: '��˾����',
        category: '��Ʒ���',
        name: '��Ʒ����'
      },
      user: {
        title: '������Ϣ',
        holder: 'Ͷ����',
        insurant: '�б���',
        credentials: '��Ч֤��',
        age: '����',
        sex: {
          title: '�Ա�',
          content: ['��', 'Ů']
        },
        status: {
          title: '����״��',
          content: ['δ��', '�ѻ�']
        },
        address: 'ͨѶ��ַ',
        contact: '��ϵ��ʽ'
      },
      policy: {
        title: '������Ϣ',
        amount: '����',
        renewal: '�Ƿ�����',
        startTime: {
          title: '��Ч����',
          placeholder: 'ѡ������'
        },
        period: '��������',
        description: '��ϸ����'
      },
      blockchain: {
        title: '������Ϣ',
        key: '�ؼ���',
        hash: '��ϣֵ',
        view: '�鿴'
      }
    }
  },
  user: {
    aside: {
      slot: [
        {
          title: '������Ϣ',
          item: ['�ҵı���', '�ҵĻ���', '�˻��Ͱ�ȫ']
        },
        {
          title: '֧��',
          item: ['���ⷴ��', '�����б�']
        }
      ]
    },
    // DONE
    detail: {
      account: {
        title: '�˻���Ϣ',
        tip: {
          title: '��ȫ��ʾ',
          description: 'Ϊ�������˻���ȫ�����������ַ��������ȫ��֤����Ҫ͸¶���ź͹ȸ���֤����κ��ˣ�����Dashboard�ͷ���'
        },
        info: {
          title: ['�˻�', '�ϴε�¼ʱ��']
        }
      },
      security: {
        title: '��ȫ����',
        google: {
          title: '�ȸ���֤',
          description: '��¼ʱ�����йȸ���֤��',
          operation: {
            set: '����',
            reset: '����',
            open: '����'
          }
        }
      },
      dialog: {
        title: '�ȸ迪��',
        placeholder: '������ȸ���֤��',
        buttonText: 'ȷ��'
      }
    },
    // DONE
    google: {
      title: ['���� �ȸ���֤', '���� �ȸ���֤'],
      step: [
        {
          text: '��װ��ɺ�򿪹ȸ���֤��ɨ���·���ά����ֶ�������Կ���õ�6λ����֤�롣',
          tip: {
            title: '��ȫ��ʾ',
            description: '��������Ʊ��ܹȸ���֤��Կ�����������ʧ�ֻ������޷�����'
          },
          qr: '��Կ'
        },
        {
          text: '�뽫����õ���֤�������·�������У��������֤��',
          form: {
            label: '�¹ȸ���֤��',
            placeholder: '�������¹ȸ���֤��',
            buttonText: 'ȷ��'
          }
        }
      ]
    },
    policy: {
      // the content follow same as market.dialog
    },
    point: {
      title: '�ҵĻ���',
      profile: {
        title: '��������',
        amount: '���û���',
        checkIn: 'ǩ��׬����',
        checkingIn: 'ǩ���С���',
        checkedIn: '������ǩ��',
        transfer: '�����˻���'
      },
      trace: {
        title: '������ϸ',
        time: 'ʱ��',
        amount: '����/֧��',
        description: '��ϸ˵��'
      },
      dialog: {
        checkIn: {
        },
        transfer: {
        }
      }
    }
  },
  admin: {
    content: '��ģ�飬���ڵ����ϲ�����'
  },
  notFound: {
    content: '�����ʵ�ҳ�治���ڣ�',
    back: '������ҳ'
  },
  company: {
  },
  message: {
    info: {},
    warning: {
      reLogin: '�û�δ��¼�������ȵ�¼!',
      jwtExpires: 'JWT�ѹ��ڣ������µ�¼!',
      jwtMalformed: 'JWT��ʽ���������µ�¼!',
      invalidToken: 'JWT��Ч�������µ�¼!',
      googleAuthNone: '�������ùȸ���֤!',
      googleAuthSetted: '�����ù��ȸ���֤!',
      googleAuthErr: '�ȸ���֤�����!',

      companyRemove: '�ñ��չ�˾��¼�����ñ�ɾ��, �Ƿ����?',
      companyCategoryExist: '��˾���ּ�¼����, �Ƿ����?',
      companyCategoryRemove: '��˾���ּ�¼�����ñ�ɾ��, �Ƿ����?',

      insuranceRemove: '�ñ��ղ�Ʒ��¼�����ñ�ɾ��, �Ƿ����?',

      addAccount: '��⵽�ⲿ�˻�',
      removeAccount: '�ⲿ�˻��˳�',
      changeAccount: '�л��ⲿ�˻�',
      refreshAccount: 'ˢ���ⲿ�˻�',
      changeNetwork: '�л��ⲿ�˻��е�����'
    },
    error: {
      USER_HAS_EXISTED: '�û��Ѵ��ڣ�',
      USER_NOT_EXIST: '�û�������!',
      USER_IS_ACTIVE: '�û��Ѽ���!',
      USER_IS_NOT_ACTIVE: '�û�δ����!',
      USER_PASSWORD_WRONG: '��¼���벻��ȷ!',
      USER_CODE_WRONG: '��֤�벻��ȷ��',
      USER_CODE_TIMEOUT: '��֤�볬ʱ��',
      USER_GOOGLE_CODE_NONE: '������ȸ���֤��',
      USER_GOOGLE_CODE_LEN_ERR: '������6λ����',
      USER_GOOGLE_AUTH_ERR: '�ȸ���֤�����',
      USER_GOOGLE_AUTH_NOT_SET: '�ȸ���֤δ������',
      USER_ADD_POLICY_FAIL: '�û�¼�뱣��ʧ�ܣ�',
      USER_MINT_FAIL: '�û��������ʧ�ܣ�',
      USER_POINT_TRANSFER_FAIL: '�û����ͻ���ʧ�ܣ�',
      USER_POINT_TRANSFER_TARGET_NONE: '������Ŀ���˻���',
      USER_POINT_TRANSFER_AMOUNT_NONE: '���������������',
      USER_CHECK_IN_FAIL: '�û�ǩ��ʧ�ܣ�',
      USER_SIGNUP_CMD_ERR: '�û�ע�����ʹ���',

      COMPANY_CATEGORIES_HAS_EXIST: '�ñ��չ�˾�������Ѵ��ڣ�',
      COMPANY_CATEGORIES_NOT_EXIST: '�ñ��չ�˾�����ֲ����ڣ�',
      COMPANY_HAS_EXISTED: '�ñ��չ�˾��Ϣ�Ѵ��ڣ�',
      COMPANY_CODE_HAS_EXISTED: '��˾�����Ѵ��ڣ�',
      COMPANY_NOT_EXIST: '�ñ��չ�˾������!',

      INSURANCE_HAS_EXISTED: '�ñ��ղ�Ʒ�Ѵ��ڣ�',
      INSURANCE_CODE_HAS_EXISTED: '��Ʒ�����Ѵ��ڣ�',
      INSURANCE_NOT_EXIST: '�ñ��ղ�Ʒ�����ڣ�',

      POLICY_COMPANY_NONE: '�����빫˾����',
      POLICY_COMPANY_LEN_ERR: '���ȴ���3���ַ�',
      POLICY_CATEGORY_NONE: '�������Ʒ����',
      POLICY_CATEGORY_LEN_ERR: '���ȴ���3���ַ�',
      POLICY_TITLE_NONE: '�������Ʒ����',
      POLICY_TITLE_LEN_ERR: '���ȴ���3���ַ�',
      POLICY_HOLDER_NONE: '������Ͷ����',
      POLICY_HOLDER_LEN_ERR: '���ȴ���1���ַ�',
      POLICY_INSURANT_NONE: '������б���',
      POLICY_INSURANT_LEN_ERR: '���ȴ���1���ַ�',
      POLICY_AMOUNT_NONE: '�����뱣��',
      POLICY_AMOUNT_LEN_ERR: '���ȴ���1���ַ�',
      POLICY_STARTTIME_NONE: '��ѡ����Ч����',
      POLICY_PERIOD_NONE: '�����뱣������',
      POLICY_PERIOD_LEN_ERR: '���ȴ���1���ַ�',

      LOGIN_ACCOUNT_NONE: '�������ֻ���/�����ַ',
      LOGIN_ACCOUNT_LEN_ERR: '������ 6 �� 64 ���ַ�',
      LOGIN_PWD_NONE: '�������¼����',
      LOGIN_PWD_LEN_ERR: '������ 3 �� 6 ���ַ�',

      SIGNUP_ACCOUNT_NONE: '�������ֻ���/�����ַ',
      SIGNUP_QUICK_ACCOUNT_NONE: '�������˺�',
      SIGNUP_ACCOUNT_LEN_ERR: '������ 6 �� 64 ���ַ�',
      SIGNUP_CODE_NONE: '������6λ��֤��',
      SIGNUP_CODE_LEN_ERR: '���ȱ������6',
      SIGNUP_PWD_NONE: '����������',
      SIGNUP_PWD_LEN_ERR: '������ 3 �� 6 ���ַ�',
      SIGNUP_PWD2_ERR: '������������벻һ��',
      'No recipients defined': '�����ʽ����',

      TOKEN_IS_MISSING: '������ʧ��',
      ROUTE_NOT_EXIST: 'ҳ�治����!',
      TIMEOUT: '���ӳ�ʱ��������һ��!',

      COMMON_PARAM_ERROR: '��������',

      'Network Error': 'ϵͳ�������Ӵ���',

      UNKNOWN: 'δ֪����'
    }
  },
  component: {
    button: {
      confirm: 'ȷ��',
      cancel: 'ȡ��',
      save: '����'
    },
    alert: {
      errorTitle: '����',
      warningTitle: '��ʾ'
    },
    loading: {
      login: '�û���¼��......',
      signUp: '�û�ע����......',
      insurance: '���ղ�Ʒ��ȡ��......',
      analytics: '�����ݷ�����........',

      myInsuranceSaving: '¼���ҵı�����......',
      myInsuranceLoading: '��ȡ�ҵı�����......',

      user: {
        point: {
          amount: '�û����ֻ�ȡ�С���',
          trace: '�û�������ϸ��ȡ�С���'
        }
      }
    }
  },
  config: {
    company: {
      PINGAN: '�й�ƽ��',
      PICC: '�й��˱�',
      CHINALIFE: '�й�����',
      CPIC: '�й�̫ƽ����',
      TAIPING: '�й�̫ƽ',
      NCI: '�»�����',
      TAIKANG: '̩������',
      SINOSIG: '���Ᵽ��',
      HUA: '���ı���',
      GUOHUA: '��������'
    },
    product: {
      PINGAN_ZYYL_ESBYLPB: '[�й�ƽ��]ƽ��e����ҽ����PLUS��',
      PINGAN_ZYYL_SHYBGMZYZFYL: '[�й�ƽ��]�Ϻ�ҽ������סԺ�Է�ҽ�Ʊ���',
      PINGAN_ZDJB_JTDBYL: '[�й�ƽ��]��ͥ��ҽ����',
      PINGAN_ZDJB_GRZDJB: '[�й�ƽ��]ƽ�������ش󼲲�����',
      PINGAN_ZDJB_CRZDJB: '[�й�ƽ��]ƽ�������ش󼲲���',
      PINGAN_YW_YNQZHYW: '[�й�ƽ��]һ�����ۺ�������',
      PINGAN_YW_JTBZHYW: '�й�ƽ����ͥ���ۺ����Ᵽ��',
      PINGAN_YW_JTCXZHYCJ: '�й�ƽ����ͥ�����ۺϱ��գ�ԭ�ݳ��գ�',
      PICC_ZYYL_RRAKBWYLJTB: '�����˰���������ҽ�Ʊ���-��ͥ��',
      PICC_YW_RSYWQNJQB: '�й��˱�����������ȫ���ǿ��',
      PICC_YW_AXCXJTGJYW: '�й��˱����ĳ��н�ͨ����������',
      PICC_YW_HKWYQWQQHY: '�й��˱����������ǡ�ǧ��ȫ������',
      PICC_YW_BWCYB: '�й��˱�������α�'
    },
    stat: {
      STAT_COMPANY: '��˾�ȶȷ���',
      STAT_PRODUCT: '��Ʒ�ȶȷ���'
    }
  }
};
export default cn;
