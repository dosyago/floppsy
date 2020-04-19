if [[ $# -eq 0 ]]; then
  echo "Supply an input file name on which to run rng tests"
  exit 1
fi

cat $1 | ../rng_tests/RNG_test stdin -a -tlmax 24 -tlmaxonly
