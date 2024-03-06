(async function () {

    let ambilSoal = async () => {
        return await fetch('./soal.json')
            .then(response => response.json())
            .then(json => {
                return json['acak'] ? acakArray(json['soal']) : json['soal'];
            })
            .catch(err => console.log(err));
    }

    const acakArray = arr => {
        const newArr = arr.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    };

    let indexSoal = 0;
    let soal_soal = await ambilSoal();
    let jawabanUser = [];
    let jawabanRagu = [];

    const clone = obj => {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    const tampilkanSoal = (indexSoal) => {
        const tempatTeksSoal = document.querySelector('#teksSoal');
        const tempatNomorSoal = document.querySelector('#nomorSoal');
        const indexPilih = ['A', 'B', 'C', 'D', 'E'];
        const soal = clone(soal_soal[indexSoal]);
        soal['pilihan'] = acakArray(soal['pilihan']);
        const tempatPilihanJawaban = document.querySelectorAll(`ul#pilihanJawaban li span`);
        const tombolPilihan = document.querySelectorAll('ul#pilihanJawaban li button');
        const raguBtn = document.querySelector('button#ragu-ragu');
        const prevBtn = document.querySelector('button#prev');
        const nextBtn = document.querySelector('button#next');
        const navSoal = document.querySelectorAll('#navigasi-soal button');
        const yakinBtn = document.querySelector('button#yakin');

        tempatNomorSoal.innerHTML = `Soal No. ${indexSoal + 1}`
        tempatTeksSoal.innerHTML = soal['soal'];

        soal['pilihan'].forEach((pilihan, i) => {
            const tempatPilihanJawaban = document.querySelector(`ul#pilihanJawaban li#pilihan${indexPilih[i]} span`);
            tempatPilihanJawaban.innerHTML = pilihan;
        });

        const jawabanSebelumnya = jawabanUser.find(obj => obj.indexSoal == indexSoal);
        const mode = document.querySelector('button#mode').dataset.mode;

        if (jawabanSebelumnya) {
            tempatPilihanJawaban.forEach(tempatPilihan => {
                if (tempatPilihan.innerHTML == jawabanSebelumnya.jawaban) {
                    const btn = tempatPilihan.parentElement.previousElementSibling.firstElementChild;

                    if (mode == 'light') {
                        tombolPilihan.forEach(tombol => {
                            tombol.classList.replace('btn-primary', 'btn-outline-primary');
                        });

                        btn.classList.replace('btn-outline-primary', 'btn-primary');
                    } else if (mode == 'dark') {
                        tombolPilihan.forEach(tombol => {
                            tombol.classList.replace('btn-light', 'btn-outline-light');
                        });

                        btn.classList.replace('btn-outline-light', 'btn-light');
                    }
                }
            });
        } else {
            if (mode == 'light') {
                tombolPilihan.forEach(tombol => {
                    tombol.classList.replace('btn-primary', 'btn-outline-primary');
                });
            } else if (mode == 'dark') {
                tombolPilihan.forEach(tombol => {
                    tombol.classList.replace('btn-light', 'btn-outline-light');
                });
            }
        }

        const indexJawabanRagu = jawabanRagu.findIndex(index => index == indexSoal);

        if (indexJawabanRagu >= 0) {
            raguBtn.classList.replace('btn-outline-warning', 'btn-warning');
        } else {
            raguBtn.classList.replace('btn-warning', 'btn-outline-warning');
        }

        if (indexSoal == 0) {
            prevBtn.classList.add('disabled');
            nextBtn.classList.remove('disabled', 'd-none');
            yakinBtn.classList.add('d-none');
        } else if (indexSoal == soal_soal.length - 1) {
            nextBtn.classList.add('disabled', 'd-none');
            prevBtn.classList.remove('disabled');
            yakinBtn.classList.remove('d-none');
        } else {
            nextBtn.classList.remove('disabled', 'd-none');
            prevBtn.classList.remove('disabled');
            yakinBtn.classList.add('d-none');
        }

        navSoal.forEach(nav => {
            const index = +nav.innerHTML - 1;
            const jawabanSebelumnya = jawabanUser.find(obj => obj.indexSoal == index);
            if (jawabanSebelumnya) {
                if (mode == 'light') {
                    nav.classList.replace('btn-outline-primary', 'btn-primary')
                } else if (mode == 'dark') {
                    nav.classList.replace('btn-outline-light', 'btn-light');
                }
            }
        })
    }

    const prevAndNext = () => {
        const prevBtn = document.querySelector('button#prev');
        const nextBtn = document.querySelector('button#next');

        prevBtn.addEventListener('click', function (e) {
            indexSoal--;
            tampilkanSoal(indexSoal);
        });

        nextBtn.addEventListener('click', function (e) {
            indexSoal++;
            tampilkanSoal(indexSoal);
        })
    }

    const pilihJawaban = () => {
        const tempatPilihanJawaban = document.querySelectorAll(`ul#pilihanJawaban li`);
        const tombolPilihan = document.querySelectorAll('ul#pilihanJawaban li button');

        tempatPilihanJawaban.forEach(tempatPilihan => {
            tempatPilihan.addEventListener('click', function (e) {
                const id = this.id;
                const btn = document.querySelector(`li#${id} button`);
                const pilihan = document.querySelector(`li#${id} span`).innerHTML;
                const mode = document.querySelector('button#mode').dataset.mode;
                const navSoal = document.querySelectorAll('#navigasi-soal button');

                if (mode == 'light') {
                    tombolPilihan.forEach(tombol => {
                        tombol.classList.replace('btn-primary', 'btn-outline-primary');
                    })
                    btn.classList.replace('btn-outline-primary', 'btn-primary');
                    navSoal.forEach(nav => {
                        const index = +nav.innerHTML - 1;
                        if (index == indexSoal) {
                            nav.classList.replace('btn-outline-primary', 'btn-primary');
                        }
                    })
                } else if (mode == 'dark') {
                    tombolPilihan.forEach(tombol => {
                        tombol.classList.replace('btn-light', 'btn-outline-light');
                    })
                    btn.classList.replace('btn-outline-light', 'btn-light');
                    navSoal.forEach(nav => {
                        const index = +nav.innerHTML - 1;
                        if (index == indexSoal) {
                            nav.classList.replace('btn-outline-light', 'btn-light');
                        }
                    })
                }

                const indexJawabanSebelumnya = jawabanUser.findIndex(obj => obj.indexSoal == indexSoal);
                if (indexJawabanSebelumnya >= 0) {
                    jawabanUser[indexJawabanSebelumnya].jawaban = pilihan;
                } else {
                    jawabanUser.push({
                        indexSoal,
                        jawaban: pilihan
                    });
                }
            })
        })
    }

    const gantiMode = () => {
        const modeBtn = document.querySelector('button#mode');
        const card = document.querySelector('.card');
        const listPilihan = document.querySelector('ul#pilihanJawaban');
        const tombolPilihan = document.querySelectorAll('ul#pilihanJawaban button');
        const modals = document.querySelectorAll('.modal-content');
        const modalsCloseButton = document.querySelectorAll('.modal-content .btn-close');
        const navSoal = document.querySelectorAll('#navigasi-soal button');

        modeBtn.addEventListener('click', function (e) {
            const mode = this.dataset.mode;
            if (mode == 'light') {
                this.setAttribute('data-mode', 'dark');
                document.body.classList.add('bg-dark');
                this.classList.replace('btn-outline-dark', 'btn-outline-light');
                this.innerHTML = 'Dark <i class="bi bi-moon"></i>';
                card.classList.add('bg-secondary', 'text-white');
                listPilihan.classList.add('dark');
                tombolPilihan.forEach(tombol => {
                    tombol.classList.replace('btn-primary', 'btn-light');
                    tombol.classList.replace('btn-outline-primary', 'btn-outline-light');
                });
                modals.forEach(modal => {
                    modal.classList.add('bg-dark', 'text-white');
                });
                modalsCloseButton.forEach(modal => {
                    modal.classList.add('btn-close-white');
                })
                navSoal.forEach(nav => {
                    nav.classList.replace('btn-primary', 'btn-light');
                    nav.classList.replace('btn-outline-primary', 'btn-outline-light');
                })
            } else if (mode == 'dark') {
                this.setAttribute('data-mode', 'light');
                document.body.classList.remove('bg-dark');
                this.classList.replace('btn-outline-light', 'btn-outline-dark');
                this.innerHTML = 'Light <i class="bi bi-brightness-high">';
                card.classList.remove('bg-secondary', 'text-white');
                listPilihan.classList.remove('dark');
                tombolPilihan.forEach(tombol => {
                    tombol.classList.replace('btn-light', 'btn-primary');
                    tombol.classList.replace('btn-outline-light', 'btn-outline-primary');
                });
                modals.forEach(modal => {
                    modal.classList.remove('bg-dark', 'text-white');
                });
                modalsCloseButton.forEach(modal => {
                    modal.classList.remove('btn-close-white');
                })
                navSoal.forEach(nav => {
                    nav.classList.replace('btn-light', 'btn-primary');
                    nav.classList.replace('btn-outline-light', 'btn-outline-primary');
                })
            }
        })
    }

    const raguRagu = () => {
        const raguBtn = document.querySelector('button#ragu-ragu');
        const navSoal = document.querySelectorAll('#navigasi-soal button');

        raguBtn.addEventListener('click', function (e) {
            const indexJawabanRagu = jawabanRagu.findIndex(index => index == indexSoal);
            const mode = document.querySelector('button#mode').dataset.mode;

            if (indexJawabanRagu >= 0) {
                jawabanRagu.splice(indexJawabanRagu, 1);
                this.classList.replace('btn-warning', 'btn-outline-warning');
                navSoal.forEach(nav => {
                    const index = +nav.innerHTML - 1;
                    const jawabanSebelumnya = jawabanUser.find(obj => obj.indexSoal == index);

                    if (index == indexSoal) {
                        if (mode == 'light') {
                            if (jawabanSebelumnya) {
                                nav.classList.replace('btn-warning', 'btn-primary');
                            } else {
                                nav.classList.replace('btn-warning', 'btn-outline-primary')
                            }
                        } else if (mode == 'dark') {
                            if (jawabanSebelumnya) {
                                nav.classList.replace('btn-warning', 'btn-light');
                            } else {
                                nav.classList.replace('btn-warning', 'btn-outline-light')
                            }
                        }
                    }
                })
            } else {
                jawabanRagu.push(indexSoal);
                this.classList.replace('btn-outline-warning', 'btn-warning');
                navSoal.forEach(nav => {
                    const index = +nav.innerHTML - 1;

                    if (index == indexSoal) {
                        nav.classList.replace('btn-outline-primary', 'btn-warning');
                        nav.classList.replace('btn-primary', 'btn-warning');
                        nav.classList.replace('btn-outline-light', 'btn-warning');
                        nav.classList.replace('btn-light', 'btn-warning');
                    }
                })
            }
        })
    }

    const navigasiSoal = () => {
        const kotakNavigasi = document.querySelector('#navigasi-soal');
        let html = ``;

        soal_soal.forEach((soal, index) => {
            html += `<button type="button"
            class="btn btn-outline-primary col-3 col-sm-2 m-1">${index + 1}</button>`;
        });

        kotakNavigasi.innerHTML = html;

        const navSoal = document.querySelectorAll('#navigasi-soal button');
        navSoal.forEach(nav => {
            nav.addEventListener('click', function (e) {
                indexSoal = +this.innerHTML - 1;

                tampilkanSoal(indexSoal);
            })
        })
    }

    const testDone = () => {
        const yakinBtn = document.querySelector('button#yakin');
        const doneBtn = document.querySelector('button#done');
        const warningAlert = document.querySelector('.modal-body .alert-warning');
        const dangerAlert = document.querySelector('.modal-body .alert-danger');
        let jumlahSoalBenar = 0;
        let nilaiPerSoal = 100 / soal_soal.length;

        yakinBtn.addEventListener('click', function (e) {
            if (jawabanRagu.length != 0 || jawabanUser.length != soal_soal.length) {
                dangerAlert.classList.remove('d-none');
                warningAlert.classList.add('d-none');
                doneBtn.classList.add('d-none');
            } else if (jawabanUser.length == soal_soal.length && jawabanRagu.length == 0) {
                dangerAlert.classList.add('d-none');
                warningAlert.classList.remove('d-none');
                doneBtn.classList.remove('d-none');
            }
        })

        doneBtn.addEventListener('click', function (e) {
            soal_soal.forEach((soal, i) => {
                const jawaban = jawabanUser.find(obj => obj.indexSoal == i);
                const kunciJawaban = soal.pilihan[soal.jawaban];

                if (jawaban.jawaban == kunciJawaban) {
                    jumlahSoalBenar++;
                }
            })
            const nilai = Math.floor(nilaiPerSoal * jumlahSoalBenar);
            tampilkanNilai(nilai, jumlahSoalBenar);
        })
    }

    const tampilkanNilai = (nilai, jumlahSoalBenar) => {
        const containerSoal = document.querySelector('#container-soal');
        const containerNilai = document.querySelector('#container-nilai');
        const footer = document.querySelector('footer');
        const jumlahSoalSalah = soal_soal.length - jumlahSoalBenar;
        const soalBenar = document.querySelector('#soal-benar');
        const soalSalah = document.querySelector('#soal-salah');
        const ulangBtn = document.querySelector('button#ulang');
        const tempatNilai = document.querySelector('h1#nilai');
        const kotakNilai = document.querySelector('#container-nilai .col-4');
        const nilaiKKM = 70;

        containerSoal.classList.add('d-none');
        footer.classList.add('d-none');
        containerNilai.classList.remove('d-none');

        if (nilai >= nilaiKKM) {
            kotakNilai.classList.add('bg-success');
        } else {
            kotakNilai.classList.add('bg-danger');
        }

        tempatNilai.innerHTML = nilai;
        soalBenar.innerHTML = `Benar : ${jumlahSoalBenar} soal`;
        soalSalah.innerHTML = `Salah : ${jumlahSoalSalah} soal`;
        ulangBtn.addEventListener('click', function (e) {
            const currentUrl = document.location.href;
            document.location.href = currentUrl;
        });
    }

    const mulaiKuis = () => {
        const mulaiBtn = document.querySelector('button#mulai');
        const containerStart = document.querySelector('#container-start');
        const containerSoal = document.querySelector('#container-soal');
        const footer = document.querySelector('footer');
        const jumlahSoal = document.querySelector('h3#jumlah-soal');

        jumlahSoal.innerHTML = `${soal_soal.length} Soal`

        mulaiBtn.addEventListener('click', function (e) {
            containerStart.classList.add('d-none');
            containerSoal.classList.remove('d-none');
            footer.classList.remove('d-none');
        })
    }

    const load = () => {
        mulaiKuis();
        tampilkanSoal(indexSoal);
        prevAndNext();
        pilihJawaban();
        navigasiSoal();
        gantiMode();
        raguRagu();
        testDone();
    }

    document.body.onload = load();
})()